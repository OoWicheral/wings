<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AuthorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $profile = $this->relationLoaded('profile')
            ? $this->profile
            : null;

        return [
            'id' => $this->id_usuario,
            'name' => $profile && $profile->nome_perfil
                ? $profile->nome_perfil
                : $this->nome,
            'avatar' => $profile && $profile->foto_perfil
                ? Storage::disk('public')->url($profile->foto_perfil)
                : null,
        ];
    }
}
