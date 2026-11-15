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
            'title'      => 'sometimes|required|string|max:50',
            'content'    => 'sometimes|required|string|max:500',
            'image'      => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'statusPost' => 'sometimes|required|string|in:ativo,inativo',
        ];
    }
}
