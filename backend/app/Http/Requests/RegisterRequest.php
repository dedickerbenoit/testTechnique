<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'last_name' => ['required', 'string'],
            'first_name' => ['required', 'string'],
            'pseudo' => ['required', 'string', 'min:3', 'max:15', 'unique:users,pseudo'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'regex:/[0-9]/', 'regex:/[A-Z]/', 'regex:/[a-z]/', 'regex:/[@$!%*#?&]/'],
            'phone' => ['required', 'string', 'regex:/^0[67]/', 'unique:users,phone'],
            'birthday' => ['required', 'date'],
        ];
    }

    public function messages(): array{
        return [
            'password.regex' => 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
            'phone.regex' => 'Le numéro de téléphone doit commencer par 06 ou 07.',
            'pseudo.min' => 'Le pseudo doit contenir au moins 3 caractères.',
            'pseudo.max' => 'Le pseudo doit contenir au maximum 15 caractères.',
        ];
    }
}
