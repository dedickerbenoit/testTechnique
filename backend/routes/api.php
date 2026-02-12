<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/users', [UserController::class, 'store'])->name('users.store')->middleware('throttle:5,1');
Route::get('/users/check-pseudo/{pseudo}', [UserController::class, 'checkPseudo'])->name('users.checkPseudo')->middleware('throttle:30,1');
