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
            'last_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'pseudo' => ['required', 'string', 'min:3', 'max:15', 'unique:users,pseudo'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:128', 'regex:/[0-9]/', 'regex:/[A-Z]/', 'regex:/[a-z]/', 'regex:/[^a-zA-Z0-9]/'],
            'phone' => ['required', 'string', 'regex:/^0[67]\d{8}$/', 'unique:users,phone'],
            'birthday' => ['required', 'date', 'before:today'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:10240'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $password = strtolower($this->input('password', ''));
            $personalInfo = [
                $this->input('last_name'),
                $this->input('first_name'),
                $this->input('pseudo'),
            ];

            $birthday = $this->input('birthday');
            if ($birthday) {
                $date = date_parse($birthday);
                if ($date['year']) {
                    $personalInfo[] = (string) $date['year'];
                    $day = str_pad($date['day'], 2, '0', STR_PAD_LEFT);
                    $month = str_pad($date['month'], 2, '0', STR_PAD_LEFT);
                    $personalInfo[] = $day . $month . $date['year'];
                    $personalInfo[] = $day . $month;
                }
            }

            foreach ($personalInfo as $info) {
                if ($info && strlen($info) >= 2 && str_contains($password, strtolower($info))) {
                    $validator->errors()->add('password', 'Le mot de passe ne doit pas contenir d\'informations personnelles.');
                    break;
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'last_name.required' => 'Le nom est requis.',
            'first_name.required' => 'Le prénom est requis.',
            'pseudo.required' => 'Le pseudo est requis.',
            'pseudo.min' => 'Le pseudo doit contenir entre 3 et 15 caractères.',
            'pseudo.max' => 'Le pseudo doit contenir entre 3 et 15 caractères.',
            'pseudo.alpha_dash' => 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.',
            'pseudo.unique' => 'Ce pseudo est déjà utilisé.',
            'email.required' => 'L\'adresse email est requise.',
            'email.email' => 'L\'adresse email n\'est pas valide.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'password.required' => 'Le mot de passe est requis.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.regex' => 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
            'phone.required' => 'Le numéro de téléphone est requis.',
            'phone.regex' => 'Le numéro de téléphone doit être au format français (06 ou 07 suivi de 8 chiffres).',
            'phone.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            'birthday.required' => 'La date de naissance est requise.',
            'birthday.date' => 'La date de naissance n\'est pas valide.',
            'birthday.before' => 'La date de naissance doit être dans le passé.',
            'avatar.image' => 'L\'avatar doit être une image.',
            'avatar.mimes' => 'L\'avatar doit être au format JPG ou PNG.',
            'avatar.max' => 'L\'avatar ne doit pas dépasser 10 Mo.',
        ];
    }
}
