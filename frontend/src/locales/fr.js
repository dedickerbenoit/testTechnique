export default {
  register: {
    title: 'Inscription',
    subtitle: 'Créez votre compte Culture et Formation',
    fields: {
      lastName: 'Nom',
      firstName: 'Prénom',
      pseudo: 'Pseudo',
      email: 'Adresse email',
      password: 'Mot de passe',
      phone: 'Numéro de téléphone',
      birthday: 'Date de naissance',
    },
    placeholders: {
      phone: '0612345678',
    },
    hints: {
      pseudo: 'Entre 3 et 15 caractères (lettres, chiffres, tirets, underscores)',
      password: '8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial',
    },
    submit: "S'inscrire",
    submitting: 'Inscription en cours...',
    success: 'Inscription réussie !',
    errors: {
      general: 'Une erreur est survenue. Veuillez réessayer.',
      lastName: { required: 'Le nom est requis.' },
      firstName: { required: 'Le prénom est requis.' },
      pseudo: {
        required: 'Le pseudo est requis.',
        length: 'Le pseudo doit contenir entre 3 et 15 caractères.',
        format: 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.',
        unique: 'Ce pseudo est déjà utilisé.',
      },
      email: {
        required: "L'adresse email est requise.",
        invalid: "L'adresse email n'est pas valide.",
        unique: 'Cette adresse email est déjà utilisée.',
      },
      password: {
        required: 'Le mot de passe est requis.',
      },
      phone: {
        required: 'Le numéro de téléphone est requis.',
        invalid: 'Le numéro doit être au format français (06 ou 07 suivi de 8 chiffres).',
        unique: 'Ce numéro de téléphone est déjà utilisé.',
      },
      birthday: {
        required: 'La date de naissance est requise.',
        invalid: 'La date de naissance doit être dans le passé.',
      },
    },
    passwordRules: {
      minLength: '8 caractères minimum',
      uppercase: 'Une majuscule',
      lowercase: 'Une minuscule',
      digit: 'Un chiffre',
      special: 'Un caractère spécial',
      noPersonalInfo: 'Ne contient pas d\'informations personnelles',
    },
    age: '{{age}} ans',
  },
}
