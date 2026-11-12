<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePublicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'userId'  => 'prohibited',
            'title'   => 'required|string|max:50',
            'content' => 'required|string|max:500',
            'image'   => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'   => 'Um título é obrigatório para a publicação',
            'content.required' => 'A postagem deve ter algum conteúdo em texto',
        ];
    }
}
