<?php

namespace App\Http\Resources;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_publicacao,
            'userId' => $this->id_usuario,
            'author' => $this->relationLoaded('user') && $this->user
                ? new AuthorResource($this->user)
                : null,
            'title' => $this->titulo_publicacao,
            'content' => $this->conteudo_publicacao,
            'image' => $this->img_anexo
                ? Storage::disk('public')->url($this->img_anexo)
                : null,
            'createdAt' => $this->criado_em,
            'updatedAt' => $this->modificado_em,
            'statusPost' => $this->status_publicacao,
            'commentsCount' => $this->whenCounted('comments'),
        ];
    }
}
