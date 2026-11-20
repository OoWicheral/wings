<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
       return [
            'id'  => $this->id_denuncia,
            'userId' => $this->id_usuario_denunciou,
            'reportedUserId' => $this->id_usuario_denunciado,
            'report' => $this->motivo_denuncia,
            'createdAt' => $this->criado_em,
            'updatedAt' => $this->modificado_em,
       ];
    }
}
