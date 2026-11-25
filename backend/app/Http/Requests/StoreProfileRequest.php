<?php

namespace App\Http\Requests;

use App\Rules\AvatarUpload;
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
            'nameProfile'   => 'required|string|max:20',
            'bio'           => 'nullable|string|max:250',
            'avatar'        => ['nullable', new AvatarUpload()],
            'statusProfile' => 'nullable|string|in:ativo,inativo',
        ];
    }

    public function messages(): array
    {
        return [
            'nameProfile.required' => 'O nome do perfil é obrigatório.',
            'nameProfile.max'      => 'O nome do perfil deve ter no máximo 20 caracteres.',
            'bio.max'              => 'A bio deve ter no máximo 250 caracteres.',
        ];
    }
}
