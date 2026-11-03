<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreChatAiMessageRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'idChat' => 'required|integer',
            'prompt' => 'required|string|min:1',
        ];
    }

    public function messages(): array
    {
        return[
            'prompt.min' => 'É necessário enviar uma mensagem que não seja vazia'
        ];
    }
}
