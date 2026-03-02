<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('users')->name('users.')->controller(UserController::class)->group(function () {
    Route::post('/', 'store')->name('store')->middleware('throttle:5,1');
    Route::get('/check-pseudo/{pseudo}', 'checkPseudo')->name('checkPseudo')->middleware('throttle:30,1');
});
