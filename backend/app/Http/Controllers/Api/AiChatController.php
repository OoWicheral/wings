<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AiChatResource;
use App\Models\AiChat;
use Illuminate\Http\Request;

class AiChatController extends Controller
{
    public function index()
    {
        $chats = AiChat::where('id_usuario', auth()->id())
        ->where('status_chat_ia', 'ativo')
        ->orderBy('criado_em', 'desc')
        ->get();

        return AiChatResource::collection($chats);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:150'
        ]);

        $chat = AiChat::create([
            'titulo_chat_ia' => $request->input('title', 'Nova conversa'),
            'id_usuario'     => auth()->id(),
            'status_chat_ia' => 'ativo',
        ]);

        return (new AiChatResource($chat))
        ->additional(['message' => 'Chat criado com sucesso'])
        ->response()
        ->setStatusCode(201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:150'
        ]);

        // Só permite editar se pertencer ao usuário e se estiver ativo
        $chat = AiChat::where('id_chat_ia', $id)
        ->where('id_usuario', auth()->id())
        ->where('status_chat_ia', 'ativo')
        ->firstOrFail();

        $chat->update([
            'titulo_chat_ia' => $request->title
        ]);

        return (new AiChatResource($chat))
        ->additional(['message' => 'Título do chat atualizado']);
    }

    public function destroy($id)
    {
        // Busca garantindo que pertence ao usuário e ainda não foi deletado
        $chat = AiChat::where('id_chat_ia', $id)
        ->where('id_usuario', auth()->id())
        ->where('status_chat_ia', 'ativo')
        ->firstOrFail();

        $chat->update([
            'status_chat_ia' => 'deletado'
        ]);

        return response()->json([
            'message' => 'Chat removido com sucesso'
        ], 200);
    }
}