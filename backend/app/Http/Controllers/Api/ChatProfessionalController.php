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
            ->with(['participants' => function ($query) use ($userId) {
                // Filtra para pegar apenas o outro participante da conversa
                $query->where('id_usuario', '!=', $userId)
                // Carrega somente os campos públicos da tabela perfil
                ->with('perfil:id_usuario,nome_perfil,foto_perfil'); 
            }])
            ->orderBy('criado_em', 'desc')
            ->get();

        return response()->json([
            'data' => $chats,
            'message' => count($chats) > 0 ? "Conversas encontradas" : "Você ainda não possui conversas",
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_sender' => 'required|integer|exists:usuario,id_usuario',
        ]);

        $senderId = auth()->id();
        $receiverId = $request->id_sender;

        // Trava de segurança: impede o usuário de abrir um chat consigo mesmo
        if ($senderId == $receiverId) {
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
            return response()->json([
                'data'    => $chatExist,
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

        return response()->json([
            'data' => $newChat,
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

        ChatParticipants::where('id_chat_profissional', $id)
            ->where('id_usuario', $userId)
            ->update([
                'limpo_em' => now()
            ]);

        return response()->json([
            'message' => 'Histórico do chat limpo.'
        ], 200);
    }
}