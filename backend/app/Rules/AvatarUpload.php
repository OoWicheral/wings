<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

/*
  Aceita a foto de perfil em dois formatos:

  - arquivo enviado (JPG, PNG ou WEBP, até 5 MB);
  - texto com o caminho já salvo (até 260 caracteres), para clientes antigos.
*/
class AvatarUpload implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if ($value instanceof UploadedFile) {
            if (!$value->isValid()) {
                $fail('O envio da foto de perfil falhou. Tente novamente.');

                return;
            }

            $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

            if (!in_array($value->getMimeType(), $allowedMimes, true)) {
                $fail('A foto de perfil deve ser JPG, PNG ou WEBP.');

                return;
            }

            if ($value->getSize() > 5 * 1024 * 1024) {
                $fail('A foto de perfil deve ter no máximo 5 MB.');
            }

            return;
        }

        if (is_string($value) && mb_strlen($value) <= 260) {
            return;
        }

        $fail('Foto de perfil inválida.');
    }
}
