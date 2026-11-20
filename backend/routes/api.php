<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatAiMessage;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

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
    // Perfil
    Route::get('/user/{id}/profile', [ProfileController::class, 'show']);
    Route::post('/user/{id}/profile', [ProfileController::class, 'store']);
    Route::match(['put', 'patch'], '/user/{id}/profile', [ProfileController::class, 'update']);
    // Usuários (Listar, Visualizar, Atualizar, Deletar)
    Route::apiResource('user', UserController::class)->except(['store']);
    // ChatAi
    Route::apiResource('chataimessage', ChatAiMessage::class);
    // Postagens
    Route::post('/posts', [PublicationController::class, 'store']);
    Route::get('/posts', [PublicationController::class, 'index']);
    Route::get('/posts/mine', [PublicationController::class, 'authUserPosts']);
    Route::get('/posts/mine/{id_publicacao}', [PublicationController::class, 'authUserUniquePost']);
    Route::get('/user/{id}/posts', [PublicationController::class, 'anyUserPosts']);
    Route::get('/posts/{id_publicacao}', [PublicationController::class, 'show']);
    Route::match(['put', 'patch'], '/posts/{id_publicacao}', [PublicationController::class, 'update']);
    Route::get('/posts/{id_publicacao}/comments', [CommentController::class, 'index']);
    Route::post('/posts/{id_publicacao}/comments', [CommentController::class, 'store']);
    Route::get('/posts/{id_publicacao}/comments/{id_comentario}', [CommentController::class, 'show']);
    Route::match(['put', 'patch'], '/posts/{id_publicacao}/comments/{id_comentario}', [CommentController::class, 'update']);
});
