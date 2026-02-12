import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

function RegisterForm() {
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    pseudo: '',
    email: '',
    password: '',
    phone: '',
    birthday: '',
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const calculateAge = (birthday) => {
    if (!birthday) return null
    const birth = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age >= 0 ? age : null
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis.'
    if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis.'

    if (!formData.pseudo.trim()) {
      newErrors.pseudo = 'Le pseudo est requis.'
    } else if (formData.pseudo.length < 3 || formData.pseudo.length > 15) {
      newErrors.pseudo = 'Le pseudo doit contenir entre 3 et 15 caractères.'
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.pseudo)) {
      newErrors.pseudo = 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.'
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'adresse email n'est pas valide."
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis.'
    } else {
      const passwordErrors = []
      if (formData.password.length < 8) passwordErrors.push('8 caractères minimum')
      if (!/[0-9]/.test(formData.password)) passwordErrors.push('un chiffre')
      if (!/[A-Z]/.test(formData.password)) passwordErrors.push('une majuscule')
      if (!/[a-z]/.test(formData.password)) passwordErrors.push('une minuscule')
      if (!/[^a-zA-Z0-9]/.test(formData.password)) passwordErrors.push('un caractère spécial')
      if (passwordErrors.length > 0) {
        newErrors.password = `Le mot de passe doit contenir : ${passwordErrors.join(', ')}.`
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis.'
    } else if (!/^0[67]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Le numéro doit être au format français (06 ou 07 suivi de 8 chiffres).'
    }

    if (!formData.birthday) {
      newErrors.birthday = 'La date de naissance est requise.'
    } else if (new Date(formData.birthday) >= new Date()) {
      newErrors.birthday = 'La date de naissance doit être dans le passé.'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/users`, formData)
      setSuccess(response.data.message)
      setFormData({
        last_name: '',
        first_name: '',
        pseudo: '',
        email: '',
        password: '',
        phone: '',
        birthday: '',
      })
      setErrors({})
    } catch (error) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors
        const formatted = {}
        Object.keys(serverErrors).forEach((key) => {
          formatted[key] = serverErrors[key][0]
        })
        setErrors(formatted)
      } else {
        setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const age = calculateAge(formData.birthday)
  const pseudoLength = formData.pseudo.length

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success && (
        <div role="alert" className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-sm">
          {success}
        </div>
      )}

      {errors.general && (
        <div role="alert" className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-text-primary mb-1">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.last_name ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-describedby={errors.last_name ? 'last_name-error' : undefined}
            aria-invalid={!!errors.last_name}
          />
          {errors.last_name && (
            <p id="last_name-error" role="alert" className="mt-1 text-sm text-red-500">
              {errors.last_name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-text-primary mb-1">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.first_name ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-describedby={errors.first_name ? 'first_name-error' : undefined}
            aria-invalid={!!errors.first_name}
          />
          {errors.first_name && (
            <p id="first_name-error" role="alert" className="mt-1 text-sm text-red-500">
              {errors.first_name}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="pseudo" className="block text-sm font-medium text-text-primary mb-1">
          Pseudo <span className="text-red-500">*</span>
          <span
            className={`ml-2 text-xs font-normal ${
              pseudoLength > 0 && (pseudoLength < 3 || pseudoLength > 15)
                ? 'text-red-500'
                : pseudoLength > 0
                  ? 'text-green-500'
                  : 'text-text-secondary'
            }`}
          >
            {pseudoLength}/15
          </span>
        </label>
        <input
          type="text"
          id="pseudo"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleChange}
          maxLength={15}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.pseudo ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-describedby={errors.pseudo ? 'pseudo-error' : 'pseudo-hint'}
          aria-invalid={!!errors.pseudo}
        />
        <p id="pseudo-hint" className="mt-1 text-xs text-text-secondary">
          Entre 3 et 15 caractères (lettres, chiffres, tirets, underscores)
        </p>
        {errors.pseudo && (
          <p id="pseudo-error" role="alert" className="mt-1 text-sm text-red-500">
            {errors.pseudo}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
          Adresse email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
          Mot de passe <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-describedby={errors.password ? 'password-error' : 'password-hint'}
          aria-invalid={!!errors.password}
        />
        <p id="password-hint" className="mt-1 text-xs text-text-secondary">
          8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial
        </p>
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-sm text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1">
          Numéro de téléphone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="0612345678"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p id="phone-error" role="alert" className="mt-1 text-sm text-red-500">
            {errors.phone}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="birthday" className="block text-sm font-medium text-text-primary mb-1">
          Date de naissance <span className="text-red-500">*</span>
          {age !== null && (
            <span className="ml-2 text-xs font-normal text-primary">
              ({age} ans)
            </span>
          )}
        </label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.birthday ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-describedby={errors.birthday ? 'birthday-error' : undefined}
          aria-invalid={!!errors.birthday}
        />
        {errors.birthday && (
          <p id="birthday-error" role="alert" className="mt-1 text-sm text-red-500">
            {errors.birthday}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary text-white font-semibold rounded-lg transition-all duration-300 hover:bg-primary-light hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? 'Inscription en cours...' : "S'inscrire"}
      </button>
    </form>
  )
}

export default RegisterForm
