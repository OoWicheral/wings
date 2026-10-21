<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:usuario,email',
            'password' => 'required|string|max:60',
            'date' => 'required|date',
            'tel' => 'required|celular_com_ddd'
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => "Nome muito grande",
            'email.email' => "Digite um email válido",
            'email.unique' => "Email já cadastrado, tente entrar",
            'password.max' => "Sua senha é muito comprida",
            'date.date' => "Insira uma data válida",
            'tel.celular_com_ddd' => "Insira um telefone válido",
        ];
    }
}
