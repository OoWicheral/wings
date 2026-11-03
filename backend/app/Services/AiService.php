<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;

class AiService
{
    public function generateResponse(string $prompt) 
    {
        $apiKey = config('services.gemini.key');
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={$apiKey}";
        $payload = [
            'systemInstruction' => [
                'parts' => [
                    ['text' => '
                            Você é o assistente virtual do projeto Wings, focado em apoiarpessoas superando dependências. 
                            Seja sempre empático e objetivo. 
                            Se o usuário perguntar sobre temas fora desse escopo (como programação, política ou esportes), diga educadamente que você só pode ajudar com assuntos relacionados ao Wings.z
                        '
                    ]
                ] 
            ],
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ];
        
        $response = Http::withoutVerifying()->post($url, $payload);

        if ($response->failed()) {
            throw new \Exception('Falha ao processar mensagem' . $response->body());
        }

        $aiText = $response->json('candidates.0.content.parts.0.text');

        return $aiText;
    }
}
