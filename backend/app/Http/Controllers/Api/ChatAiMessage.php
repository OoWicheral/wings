<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AiMessages;
use App\Http\Requests\StoreChatAiMessageRequest;
use App\Services\AiService;
use Illuminate\Support\Facades\DB;

class ChatAiMessage extends Controller
{
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
}
