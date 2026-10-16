<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('user/login', [UserController::class, 'login']);
Route::apiResource('user', UserController::class);

