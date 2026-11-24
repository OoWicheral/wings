<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\AiMessageResource;
use App\Models\AiMessages;
use App\Models\AiChat;
use App\Http\Requests\StoreChatAiMessageRequest;
use App\Services\AiService;
use Illuminate\Support\Facades\DB;

class ChatAiMessage extends Controller
{
    public function index(Request $request, $chatId)
    {
        $chat = AiChat::where('id_chat_ia', $chatId)
        ->where('id_usuario', auth()->id())
        ->firstOrFail();

        $messages = AiMessages::where('id_chat', $chat->id_chat_ia)
        ->orderBy('criado_em', 'desc')
        ->orderBy('id_msg', 'desc')
        ->cursorPaginate(20);

        return AiMessageResource::collection($messages);
    }

    public function store(StoreChatAiMessageRequest $request, AiService $aiService)
    {
        $messages = DB::transaction(function() use ($request, $aiService) 
        {
            $userMessage = AiMessages::create([
                'conteudo_msg' => $request->prompt,
                'id_usuario' => auth()->id(),
                'id_chat' => $request->idChat,
            ]);

            $geminiResponse = $aiService->generateResponse($request->prompt); //gemini gera reposta
            
            $aiMessage = AiMessages::create([
                'conteudo_msg' => $geminiResponse,
                'id_chat' => $request->idChat,
            ]);

            return [
                'user' => $userMessage,
                'ai'   => $aiMessage,
            ];
        });

        return response()->json([
            'user_message' => new AiMessageResource($messages['user']),
            'ai_message'   => new AiMessageResource($messages['ai']),
        ], 201);      
    }

    public function update(Request $request, $messageId)
    {
        $request->validate([
            'prompt' => 'required|string|min:1'
        ]);

        $message = AiMessages::where('id_msg', $messageId)
        ->where('id_usuario', auth()->id())
        ->firstOrFail();

        $message->update([
            'conteudo_msg' => $request->prompt
        ]);

        return (new AiMessageResource($message))
        ->additional(['message' => 'Mensagem atualizada com sucesso']);
    }

    public function destroy($messageId)
    {
        $message = AiMessages::findOrFail($messageId);

        // Verifica na tabela de Chats se o dono da conversa é o usuário logado
        $chat = AiChat::where('id_chat_ia', $message->id_chat)
                    ->where('id_usuario', auth()->id())
                    ->firstOrFail();

        $message->delete();

        return response()->json([
            'message' => 'Mensagem removida com sucesso'
        ], 200);
    }
}
