<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Handle user login and generate JWT token
     */
    public function login(Request $request)
    {
        $data = $request->validate(
            [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ],
            [
                'email.required' => 'O email é obrigatório.',
                'email.email' => 'O email deve ser um endereço de email válido.',
                'password.required' => 'A senha é obrigatória.',
                'password.min' => 'A senha deve ter no mínimo 6 caracteres.',
            ]
        );

        try {
            if (! $token = JWTAuth::attempt($data)) {
                return response()->json(['error' => 'Credenciais inválidas'], 401);
            }

            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
                'user' => new UserResource(auth()->user()),
            ]);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Não foi possível criar o token'], 500);
        }
    }

    /**
     * Handle the incoming request (invocable controller fallback)
     */
    public function __invoke(Request $request)
    {
        return $this->login($request);
    }

    /**
     * Invalidate current JWT token (Logout)
     */
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Desconectado com sucesso']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Falha ao realizar logout'], 500);
        }
    }

    /**
     * Return currently authenticated user
     */
    public function me()
    {
        $user = auth()->user();

        if (! $user) {
            return response()->json(['error' => 'Usuário não autenticado'], 401);
        }

        return response()->json(new UserResource($user));
    }
}

