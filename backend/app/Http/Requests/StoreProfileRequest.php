<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');

        return [
            'userId'        => 'prohibited',
            'nameProfile'   => 'required|string|max:255',
            'bio'           => 'nullable|string|max:500',
            'avatar'        => 'nullable|string',
            'statusProfile' => 'nullable|string|in:ativo,inativo',
        ];
    }

    public function messages(): array
    {
        return [
            'nameProfile.required' => 'O nome do perfil é obrigatório.',
        ];
    }
}
