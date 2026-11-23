<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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

        return response()->json($messages, 200);
    }

    public function store(StoreChatAiMessageRequest $request, AiService $aiService)
    {
        $aiResponse = DB::transaction(function() use ($request, $aiService) 
        {
            AiMessages::create([
                'conteudo_msg' => $request->prompt,
                'id_usuario' => auth()->id(),
                'id_chat' => $request->idChat,
            ]);

            $geminiResponse = $aiService->generateResponse($request->prompt); //gemini gera reposta
            
            AiMessages::create([
                'conteudo_msg' => $geminiResponse,
                'id_chat' => $request->idChat,
            ]);

            return $geminiResponse;
        });

        return response()->json([
            'data' => $aiResponse,
            'message' => 'Mensagem enviada com sucesso',
        ], 200);        

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

        return response()->json([
            'data' => $message,
            'message' => 'Mensagem atualizada com sucesso'
        ], 200);
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
