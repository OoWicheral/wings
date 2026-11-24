<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nameProfile'   => 'nullable|string|max:20',
            'bio'           => 'nullable|string|max:250',
            'avatar'        => 'nullable|string|max:260',
            'statusProfile' => 'nullable|string|in:ativo,inativo',
        ];
    }

    public function messages(): array
    {
        return [
            'nameProfile.max' => 'O nome do perfil deve ter no máximo 20 caracteres.',
            'bio.max'         => 'A bio deve ter no máximo 250 caracteres.',
        ];
    }
}
