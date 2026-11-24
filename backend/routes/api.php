<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatAiMessage;
use App\Http\Controllers\Api\AiChatController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProfessionalController;
use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\ChatProfessionalController;
use App\Http\Controllers\Api\MessagesProfessionalController;
use App\Http\Controllers\Api\ReportController;
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

    // Profissionais
    Route::get('/professionals', [ProfessionalController::class, 'index']);
    Route::get('/user/{id}/professional', [ProfessionalController::class, 'show']);
    Route::post('/user/{id}/professional', [ProfessionalController::class, 'store']);
    Route::match(['put', 'patch'], '/user/{id}/professional', [ProfessionalController::class, 'update']);

    // Usuários (Listar, Visualizar, Atualizar)
    Route::apiResource('user', UserController::class)->except(['store', 'destroy']);

    // ChatAI
    Route::apiResource('chats', AiChatController::class);
    
    // Mensagens ChatAI
    Route::get('/chats/{chatId}/messages', [ChatAiMessage::class, 'index']);
    Route::post('/chats/messages', [ChatAiMessage::class, 'store']);
    Route::match(['put', 'patch'], '/messages/{messageId}', [ChatAiMessage::class, 'update']);
    Route::delete('/messages/{messageId}', [ChatAiMessage::class, 'destroy']);

    // Postagens
    Route::post('/posts', [PublicationController::class, 'store']);
    Route::get('/posts', [PublicationController::class, 'index']);
    Route::get('/posts/search', [PublicationController::class, 'search']);
    Route::get('/posts/mine', [PublicationController::class, 'authUserPosts']);
    Route::get('/posts/mine/{id_publicacao}', [PublicationController::class, 'authUserUniquePost']);
    Route::get('/user/{id}/posts', [PublicationController::class, 'anyUserPosts']);
    Route::get('/posts/{id_publicacao}', [PublicationController::class, 'show']);
    Route::match(['put', 'patch'], '/posts/{id_publicacao}', [PublicationController::class, 'update']);
    Route::delete('/posts/{id_publicacao}', [PublicationController::class, 'destroy']);

    // Comentários
    Route::get('/posts/{id_publicacao}/comments', [CommentController::class, 'index']);
    Route::post('/posts/{id_publicacao}/comments', [CommentController::class, 'store']);
    Route::get('/posts/{id_publicacao}/comments/{id_comentario}', [CommentController::class, 'show']);
    Route::match(['put', 'patch'], '/posts/{id_publicacao}/comments/{id_comentario}', [CommentController::class, 'update']);
    
    // Denúncias
    Route::get('/reports/mine', [ReportController::class, 'authUserReports']);
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/{id_denuncia}', [ReportController::class, 'show']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::match(['put', 'patch'], '/reports/{id_denuncia}', [ReportController::class, 'update']);
    Route::get('/user/{id}/reports', [ReportController::class, 'anyUserReports']);

    // Chat com Profissional
    Route::apiResource('chats-professional', ChatProfessionalController::class)
    ->only(['index', 'store', 'destroy']);

    // Mensagens no chat com Profissional
    Route::get('/chats-profissionais/{chatId}/messages', [MessagesProfessionalController::class, 'index']);

    Route::post('/chats-profissionais/{chatId}/messages', [MessagesProfessionalController::class, 'store']);

    Route::get('/chats-profissionais/{chatId}/messages/{messageId}/file/{type}', [MessagesProfessionalController::class, 'getFile'])
    ->whereIn('type', ['anexo', 'audio'])
    ->name('chat.message.file');
});
