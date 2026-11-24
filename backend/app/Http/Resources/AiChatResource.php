<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiChatResource extends JsonResource
{
    /**
     * Transforma o resource em um array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'chat_id' => $this->id_chat_ia, // Recomendado incluir para o frontend saber qual chat abrir
            'title' => $this->titulo_chat_ia, // Ajuste se o nome da coluna no banco for outro
            'create_at' => $this->criado_em,
        ];
    }
}