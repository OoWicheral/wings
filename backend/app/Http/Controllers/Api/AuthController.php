<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Handle the incoming request
     */
    public function __invoke(Request $request)
    {
        $data = $request->validate(
            [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ],
            [
                'email.required' => 'O email é obrigatório.',
                'email.email' => 'O email deve ser um endereço de email válido.',
                'password.required' => 'A senha é obrigatório.',
                'password.min' => 'A senha deve ter no mínimo 6 caracteres.',
            ]

        );

        try {
            if (! $token = JWTAuth::attempt($data)) {
                return response()->json(['error' => 'Credenciais inválidas'], 401);
            }

            return response()->json([
                'acces_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60
            ]);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Não foi possível criar o token'], 500);
        }
    }
}
