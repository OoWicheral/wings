<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

/*
Rotas Públicas (Sem necessidade de Token JWT)
*/

// Criação de usuário (Cadastro)
Route::post('user', [UserController::class, 'store']);

// Autenticação (Login)
Route::post('auth/login', [AuthController::class, 'login']);

/*
Rotas Protegidas (Exigem Token JWT válido)
*/
Route::middleware('jwt')->group(function () {
    // Autenticação
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Usuários (Listar, Visualizar, Atualizar, Deletar)
    Route::apiResource('user', UserController::class)->except(['store']);
});

