<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProfessionalResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id_usuario,
            'crpRegion' => $this->crp_regiao,
            'crpNumber' => $this->crp_num,
            'cip' => Storage::disk('public')->url($this->cip),
            'crpRegularity' => Storage::disk('public')->url($this->regu_crp),
            'ePsi' => $this->e_psi
                ? Storage::disk('public')->url($this->e_psi)
                : null,
            'registerStatus' => $this->registro_status,
            'certificateExpiring' => $this->data_expira_certificado,
            'epsiAuth' => (bool) $this->e_psi_autorizacao,
        ];
    }
}
