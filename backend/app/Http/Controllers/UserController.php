<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Database\QueryException;

class UserController extends Controller
{
    public function store(RegisterRequest $request)
    {
        $validated = $request->validated();

        try {
            $user = new User();
            $user->last_name = $validated['last_name'];
            $user->first_name = $validated['first_name'];
            $user->pseudo = $validated['pseudo'];
            $user->email = $validated['email'];
            $user->password = $validated['password'];
            $user->phone = $validated['phone'];
            $user->birthday = $validated['birthday'];
            $user->save();
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'inscription.',
            ], 500);
        }

        return response()->json([
            'message' => 'Inscription réussie !',
            'user' => new UserResource($user),
        ], 201);
    }
}
