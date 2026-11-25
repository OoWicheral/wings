<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfessionalMessageResource;
use App\Models\ChatParticipants;
use App\Models\MessagesProfessional;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class MessagesProfessionalController extends Controller
{
    public function getFile($chatId, $messageId, $type)
    {
        $userId = auth()->id();

        // Trava de segurança: O usuário logado pertence a este chat?
        $participant = ChatParticipants::where('id_chat_profissional', $chatId)
            ->where('id_usuario', $userId)
            ->first();

        if (!$participant) {
            return response()->json(['message' => 'Acesso negado a este arquivo.'], 403);
        }

        // Busca a mensagem dentro deste chat
        $query = MessagesProfessional::where('id_chat_profissional', $chatId)
            ->where('id_msg', $messageId); // Ajuste para a PK exata da sua tabela

        // Respeita o limpo_em (se o usuário limpou o chat, também não baixa anexos antigos)
        if ($participant->limpo_em !== null) {
            $query->where('criado_em', '>', $participant->limpo_em);
        }

        $message = $query->firstOrFail();

        // Pega o caminho correspondente ao tipo solicitado ('anexo' ou 'audio')
        $path = ($type === 'audio') ? $message->audio : $message->anexo_msg;

        if (!$path || !Storage::disk('local')->exists($path)) {
            return response()->json(['message' => 'Arquivo não encontrado.'], 404);
        }

        // Entrega o arquivo diretamente (exibe imagem/áudio no navegador ou baixa PDF)
        return Storage::disk('local')->response($path);
    }

    public function index($chatId)
    {
        $userId = auth()->id();

        // Verifica se o usuário participa deste chat e pega o timestamp limpo_em dele
        $participant = ChatParticipants::where('id_chat_profissional', $chatId)
            ->where('id_usuario', $userId)
            ->first();

        if (!$participant) {
            return response()->json([
                'message' => 'Acesso negado ou chat inexistente.'
            ], 403);
        }

        $perPage = 20;

        $query = MessagesProfessional::where('id_chat_profissional', $chatId);

        // Se este usuário já limpou o chat antes, mostra só mensagens posteriores
        if ($participant->limpo_em !== null) {
            $query->where('criado_em', '>', $participant->limpo_em);
        }

        $messages = $query->orderBy('criado_em', 'desc')
            ->orderBy('id_msg', 'desc') 
            ->cursorPaginate($perPage);

        // Mesmo envelope do chat da IA: { data, links, meta.next_cursor }.
        return ProfessionalMessageResource::collection($messages);
    }

    public function store(Request $request, $chatId)
    {
        $request->validate([
            // A coluna mensagem_chat_profissional.conteudo_msg é VARCHAR(1000).
            'conteudo_msg' => 'nullable|string|max:1000|required_without_all:anexo_msg,audio',
            // Aceita imagens e PDFs até 10MB (10240 KB)
            'anexo_msg'    => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf,doc,docx|max:10240|required_without_all:conteudo_msg,audio',
            // Aceita áudios até 10MB
            'audio'        => 'nullable|file|mimes:mp3,wav,ogg,m4a,webm|max:10240|required_without_all:conteudo_msg,anexo_msg',
        ], [
            'conteudo_msg.required_without_all' => 'Envie um texto, um anexo ou um áudio para registrar a mensagem.',
            'conteudo_msg.max'                  => 'A mensagem pode ter no máximo 1000 caracteres.',
            'anexo_msg.required_without_all'    => 'Envie um texto, um anexo ou um áudio para registrar a mensagem.',
            'audio.required_without_all'        => 'Envie um texto, um anexo ou um áudio para registrar a mensagem.',
        ]);

        $userId = auth()->id();

        $isParticipant = ChatParticipants::where('id_chat_profissional', $chatId)
            ->where('id_usuario', $userId)
            ->exists();

        if (!$isParticipant) {
            return response()->json([
                'message' => 'Você não tem permissão para enviar mensagens neste chat.'
            ], 403);
        }

        // Processa o upload do anexo, se enviado
        $anexoPath = null;
        if ($request->hasFile('anexo_msg')) {
            $anexoPath = $request->file('anexo_msg')->store('chats/anexos', 'local');
        }

        // Processa o upload do áudio, se enviado
        $audioPath = null;
        if ($request->hasFile('audio')) {
            $audioPath = $request->file('audio')->store('chats/audios', 'local');
        }

        // Salva apenas os caminhos no banco de dados
        $message = MessagesProfessional::create([
            'conteudo_msg'         => $request->input('conteudo_msg'),
            'anexo_msg'            => $anexoPath,
            'audio'                => $audioPath,
            'id_usuario'           => $userId,
            'id_chat_profissional' => $chatId,
        ]);

        return (new ProfessionalMessageResource($message))
            ->additional(['message' => 'Mensagem enviada com sucesso.'])
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, $chatId, $messageId)
    {
        $request->validate([
            'conteudo_msg' => 'required|string|max:1000',
        ], [
            'conteudo_msg.required' => 'É necessário enviar um texto para editar a mensagem.',
            'conteudo_msg.max'      => 'A mensagem pode ter no máximo 1000 caracteres.',
        ]);

        $message = $this->findOwnMessage($chatId, $messageId);

        if (!$message) {
            return response()->json([
                'message' => 'Mensagem não encontrada ou acesso negado.'
            ], 404);
        }

        $message->update([
            'conteudo_msg' => $request->input('conteudo_msg'),
        ]);

        return (new ProfessionalMessageResource($message->refresh()))
            ->additional(['message' => 'Mensagem atualizada com sucesso.']);
    }

    public function destroy($chatId, $messageId)
    {
        $message = $this->findOwnMessage($chatId, $messageId);

        if (!$message) {
            return response()->json([
                'message' => 'Mensagem não encontrada ou acesso negado.'
            ], 404);
        }

        // Remove também os arquivos enviados junto da mensagem.
        foreach ([$message->anexo_msg, $message->audio] as $path) {
            if ($path) {
                Storage::disk('local')->delete($path);
            }
        }

        $message->delete();

        return response()->json([
            'message' => 'Mensagem excluída com sucesso.'
        ], 200);
    }

    /*
      Busca uma mensagem do próprio usuário dentro do chat. Devolve null tanto
      quando o chat não é dele quanto quando a mensagem é de outra pessoa.
    */
    private function findOwnMessage($chatId, $messageId): ?MessagesProfessional
    {
        $userId = auth()->id();

        $isParticipant = ChatParticipants::where('id_chat_profissional', $chatId)
            ->where('id_usuario', $userId)
            ->exists();

        if (!$isParticipant) {
            return null;
        }

        return MessagesProfessional::where('id_chat_profissional', $chatId)
            ->where('id_msg', $messageId)
            ->where('id_usuario', $userId)
            ->first();
    }
}