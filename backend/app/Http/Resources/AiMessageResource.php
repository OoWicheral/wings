<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiMessageResource extends JsonResource
{
    /**
     * Transforma o resource em um array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_msg' => $this->id_msg,
            'content' => $this->conteudo_msg,
            // Se id_usuario não for nulo, é do usuário; caso contrário, é da IA
            'is_user' => $this->id_usuario !== null ? 'usuario' : 'ia',
            'created_at' => $this->criado_em,
        ];
    }
}