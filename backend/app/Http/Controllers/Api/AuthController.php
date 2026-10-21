<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Http\Requests\AuthUserRequest;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Handle user login and generate JWT token
     */
    public function login(AuthUserRequest $request)
    {
        try {
            if (! $token = JWTAuth::attempt($request->validated())) {
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
    public function __invoke(AuthUserRequest $request)
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

