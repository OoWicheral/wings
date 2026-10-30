<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'userId' => $this->id_usuario,
            'nameProfile' => $this->nome_perfil,
            'bio' => $this->bio_perfil,
            'avatar' => $this->foto_perfil,
            'statusProfile' => $this->status_perfil,
            'createdAt' => $this->criado_em,
            'updatedAt' => $this->modificado_em,
        ];
    }
}