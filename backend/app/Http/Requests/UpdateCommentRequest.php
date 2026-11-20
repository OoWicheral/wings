<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'userId'  => 'prohibited',
            'postId'  => 'prohibited',
            'content' => 'sometimes|required|string|max:150',
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'O comentário deve ter algum conteúdo em texto',
        ];
    }
}
