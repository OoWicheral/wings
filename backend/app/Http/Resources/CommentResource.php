<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_comentario,
            'userId' => $this->id_usuario,
            'postId' => $this->id_publicacao,
            'content' => $this->conteudo_comentario,
            'createdAt' => $this->criado_em,
            'updatedAt' => $this->modificado_em, 
        ];
    }
}
