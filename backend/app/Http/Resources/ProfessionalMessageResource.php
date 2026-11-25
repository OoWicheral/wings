<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfessionalMessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_msg' => $this->id_msg,
            'content' => $this->conteudo_msg,
            'id_usuario' => $this->id_usuario,
            'id_chat_profissional' => $this->id_chat_profissional,
            'created_at' => $this->criado_em,
            'updated_at' => $this->modificado_em,
            'anexo_url' => $this->anexo_url,
            'audio_url' => $this->audio_url,
        ];
    }
}
