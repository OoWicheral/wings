<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePublicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'      => 'nullable|string|max:50',
            'content'    => 'nullable|string|max:500',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'statusPost' => 'nullable|string|in:ativo,inativo',
        ];
    }
}
