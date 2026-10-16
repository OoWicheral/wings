<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user');
        $user = User::find($userId);

        $rules = [
            'name' => 'sometimes|required|string|max:50',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('usuario', 'email')->ignore($userId, 'id_usuario'),
            ],
            'date' => 'sometimes|required|date',
            'password' => 'sometimes|required|string|max:50',
            'statusUser' => 'sometimes|required|string',
            'numReport' => 'sometimes|required|int',
            'timeSusp' => 'sometimes|required|date',
            'isAdmin' => 'sometimes|required|boolean',
            'isProf' => 'sometimes|required|boolean',
            'tel' => 'sometimes|required|celular_com_ddd'
        ];

        if ($user && !empty($user->cpf)) {
            $rules['cpf'] = 'prohibited';
        } else {
            $rules['cpf'] = 'sometimes|required|max:11|cpf|unique:usuario,cpf';
        }

        return $rules;
    }
}
