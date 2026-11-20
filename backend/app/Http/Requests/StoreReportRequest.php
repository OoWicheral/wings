<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'userId' => 'prohibited',
            'reportedUserId' => 'required|integer|exists:usuario,id_usuario',
            'report' => 'required|string|max:200',
        ];
    }

    public function messages(): array
    {
        return [
            'report.required' => 'A denúncia deve ter um motivo',
            'reportedUserId.required' => 'A denúncia deve ser referenciada a um usuário',
        ];
    }
}
