<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfessionalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (in_array($this->input('epsiAuth'), [true, 1, '1'], true)) {
            $this->merge(['epsiAuth' => true]);
        } elseif (in_array($this->input('epsiAuth'), [false, 0, '0'], true)) {
            $this->merge(['epsiAuth' => false]);
        }
    }

    public function rules(): array
    {
        return [
            'id' => 'prohibited',
            'crpRegion' => 'sometimes|required|string|size:2',
            'crpNumber' => 'sometimes|required|string|max:12',
            'cip' => 'sometimes|required|file|mimes:pdf,jpg,jpeg,png,webp|max:5120',
            'crpRegularity' => 'sometimes|required|file|mimes:pdf,jpg,jpeg,png,webp|max:5120',
            'ePsi' => 'sometimes|nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:5120',
            'registerStatus' => 'sometimes|required|string|in:ativo,inativo,suspenso,cancelado,pendente',
            'certificateExpiring' => 'sometimes|required|date_format:Y-m-d',
            'epsiAuth' => 'sometimes|required|boolean',
        ];
    }
}
