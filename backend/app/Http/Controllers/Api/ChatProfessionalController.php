<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatParticipants;
use App\Models\ChatProfessional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatProfessionalController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $chats = ChatProfessional::whereHas('participants', function ($query) use ($userId) {
                $query->where('id_usuario', $userId);
            })
            ->with($this->relationsFor($userId))
            ->orderBy('criado_em', 'desc')
            ->get();

        return response()->json([
            'data' => $chats->map(fn (ChatProfessional $chat) => $this->present($chat))->values(),
            'message' => $chats->isNotEmpty() ? 'Conversas encontradas' : 'Você ainda não possui conversas',
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_sender' => 'required|integer|exists:usuario,id_usuario',
        ]);

        $senderId = auth()->id();
        $receiverId = (int) $request->id_sender;

        // Trava de segurança: impede o usuário de abrir um chat consigo mesmo
        if ((int) $senderId === $receiverId) {
            return response()->json([
                'message' => 'Você não pode iniciar um chat consigo mesmo.'
            ], 422);
        }

        // 1. Verifica se já existe um chat onde ambos são participantes
        $chatExist = ChatProfessional::whereHas('participants', function ($q) use ($senderId) {
                $q->where('id_usuario', $senderId);
            })
            ->whereHas('participants', function ($q) use ($receiverId) {
                $q->where('id_usuario', $receiverId);
            })
            ->first();

        if ($chatExist) {
            $chatExist->load($this->relationsFor($senderId));

            return response()->json([
                'data'    => $this->present($chatExist),
                'message' => 'Chat existente recuperado.'
            ], 200);
        }

        // 2. Se não existir, cria o chat e insere os 2 participantes atomicamente
        $newChat = DB::transaction(function () use ($senderId, $receiverId) {
            $chat = ChatProfessional::create([]);

            // Insere o usuário logado
            ChatParticipants::create([
                'id_chat_profissional' => $chat->id_chat_profissional,
                'id_usuario' => $senderId,
                'limpo_em' => null,
            ]);

            // Insere o profissional/cliente destinatário
            ChatParticipants::create([
                'id_chat_profissional' => $chat->id_chat_profissional,
                'id_usuario' => $receiverId,
                'limpo_em' => null,
            ]);

            return $chat;
        });

        $newChat->load($this->relationsFor($senderId));

        return response()->json([
            'data'    => $this->present($newChat),
            'message' => 'Novo chat criado com sucesso.'
        ], 201);
    }

    public function destroy($id)
    {
        $userId = auth()->id();

        // Verifica se o usuário realmente participa desse chat
        $participant = ChatParticipants::where('id_chat_profissional', $id)
            ->where('id_usuario', $userId)
            ->first();

        if (!$participant) {
            return response()->json([
                'message' => 'Chat não encontrado ou acesso negado.'
            ], 404);
        }

        // A limpeza é individual: o histórico continua existindo para o outro.
        ChatParticipants::where('id_chat_profissional', $id)
            ->where('id_usuario', $userId)
            ->update([
                'limpo_em' => now()
            ]);

        return response()->json([
            'message' => 'Histórico do chat limpo.'
        ], 200);
    }

    /*
      Carrega o "outro" participante (com nome e foto) e a última mensagem,
      usados no resumo da lista de conversas.
    */
    private function relationsFor(int $userId): array
    {
        return [
            'participants' => function ($query) use ($userId) {
                $query->where('id_usuario', '!=', $userId)
                    ->with([
                        'user:id_usuario,nome',
                        'perfil:id_usuario,nome_perfil,foto_perfil',
                    ]);
            },
            'latestMessage',
        ];
    }

    private function present(ChatProfessional $chat): array
    {
        $other = $chat->participants->first();

        return [
            'chat_id' => $chat->id_chat_profissional,
            'created_at' => $chat->criado_em,
            'participant' => [
                'id' => $other?->id_usuario,
                'name' => $other?->perfil?->nome_perfil ?: $other?->user?->nome,
                'avatar' => $other?->perfil?->foto_perfil,
            ],
            'last_message' => $chat->latestMessage ? [
                'content' => $chat->latestMessage->conteudo_msg,
                'created_at' => $chat->latestMessage->criado_em,
            ] : null,
        ];
    }
}
