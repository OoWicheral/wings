<?php

namespace App\Http\Requests\Api;

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
            'nameProfile'   => 'nullable|string|max:255',
            'bio'           => 'nullable|string|max:500',
            'avatar'        => 'nullable|string', 
            'statusProfile' => 'nullable|string|in:ativo,inativo',
        ];
    }
}
