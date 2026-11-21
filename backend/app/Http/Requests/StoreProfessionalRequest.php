<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfessionalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mergeIfMissing([
            'registerStatus' => 'pendente',
            'epsiAuth' => false,
        ]);

        $epsiAuth = $this->input('epsiAuth');

        if (in_array($epsiAuth, [true, 1, '1'], true)) {
            $this->merge(['epsiAuth' => true]);
        } elseif (in_array($epsiAuth, [false, 0, '0'], true)) {
            $this->merge(['epsiAuth' => false]);
        }
    }

    public function rules(): array
    {
        return [
            'id' => 'prohibited',
            'crpRegion' => 'required|string|size:2',
            'crpNumber' => 'required|string|max:12',
            'cip' => 'required|file|mimes:pdf,jpg,jpeg,png,webp|max:5120',
            'crpRegularity' => 'required|file|mimes:pdf,jpg,jpeg,png,webp|max:5120',
            'ePsi' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:5120',
            'registerStatus' => 'required|string|in:ativo,inativo,suspenso,cancelado,pendente',
            'certificateExpiring' => 'required|date_format:Y-m-d',
            'epsiAuth' => 'required|boolean',
        ];
    }
}
