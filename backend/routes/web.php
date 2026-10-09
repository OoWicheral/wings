<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProdutoController;

Route::inertia('/', 'welcome')->name('home');

Route::get('/', [ProdutoController::class, 'index']);
