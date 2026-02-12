import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { registerUser, checkPseudoAvailability } from '../services/userService'
import useDebounce from '../hooks/useDebounce'
import Input from './ui/Input'
import Button from './ui/Button'
import PasswordStrengthIndicator from './ui/PasswordStrengthIndicator'

function RegisterForm() {
  const { t } = useTranslation()

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
  const [pseudoAvailable, setPseudoAvailable] = useState(null)

  const debouncedPseudo = useDebounce(formData.pseudo, 500)

  useEffect(() => {
    if (!debouncedPseudo || debouncedPseudo.length < 3 || !/^[a-zA-Z0-9_-]+$/.test(debouncedPseudo)) {
      setPseudoAvailable(null)
      return
    }

    checkPseudoAvailability(debouncedPseudo)
      .then((data) => {
        setPseudoAvailable(data.available)
        if (!data.available) {
          setErrors((prev) => ({ ...prev, pseudo: t('register.errors.pseudo.unique') }))
        } else {
          setErrors((prev) => ({ ...prev, pseudo: '' }))
        }
      })
      .catch(() => setPseudoAvailable(null))
  }, [debouncedPseudo, t])

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setSuccess(data.message || t('register.success'))
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
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors
        const formatted = {}
        Object.keys(serverErrors).forEach((key) => {
          formatted[key] = serverErrors[key][0]
        })
        setErrors(formatted)
      } else {
        setErrors({ general: t('register.errors.general') })
      }
    },
  })

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

    if (!formData.last_name.trim()) newErrors.last_name = t('register.errors.lastName.required')
    if (!formData.first_name.trim()) newErrors.first_name = t('register.errors.firstName.required')

    if (!formData.pseudo.trim()) {
      newErrors.pseudo = t('register.errors.pseudo.required')
    } else if (formData.pseudo.length < 3 || formData.pseudo.length > 15) {
      newErrors.pseudo = t('register.errors.pseudo.length')
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.pseudo)) {
      newErrors.pseudo = t('register.errors.pseudo.format')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('register.errors.email.required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('register.errors.email.invalid')
    }

    if (!formData.password) {
      newErrors.password = t('register.errors.password.required')
    } else {
      const hasMinLength = formData.password.length >= 8
      const hasUpper = /[A-Z]/.test(formData.password)
      const hasLower = /[a-z]/.test(formData.password)
      const hasDigit = /[0-9]/.test(formData.password)
      const hasSpecial = /[^a-zA-Z0-9]/.test(formData.password)
      if (!hasMinLength || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        newErrors.password = t('register.errors.password.required')
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('register.errors.phone.required')
    } else if (!/^0[67]\d{8}$/.test(formData.phone)) {
      newErrors.phone = t('register.errors.phone.invalid')
    }

    if (!formData.birthday) {
      newErrors.birthday = t('register.errors.birthday.required')
    } else if (new Date(formData.birthday) >= new Date()) {
      newErrors.birthday = t('register.errors.birthday.invalid')
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess('')

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    mutation.mutate(formData)
  }

  const isFieldValid = (name) => {
    if (!formData[name]) return false
    if (errors[name]) return false

    switch (name) {
      case 'last_name':
      case 'first_name':
        return formData[name].trim().length > 0
      case 'pseudo':
        return formData[name].length >= 3 && formData[name].length <= 15 && /^[a-zA-Z0-9_-]+$/.test(formData[name]) && pseudoAvailable === true
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[name])
      case 'password': {
        const p = formData[name]
        return p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^a-zA-Z0-9]/.test(p)
      }
      case 'phone':
        return /^0[67]\d{8}$/.test(formData[name])
      case 'birthday':
        return new Date(formData[name]) < new Date()
      default:
        return false
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
        <Input
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          label={t('register.fields.lastName')}
          required
          error={errors.last_name}
          isValid={isFieldValid('last_name')}
        />
        <Input
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          label={t('register.fields.firstName')}
          required
          error={errors.first_name}
          isValid={isFieldValid('first_name')}
        />
      </div>

      <div className="mb-4">
        <Input
          id="pseudo"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleChange}
          label={t('register.fields.pseudo')}
          required
          error={errors.pseudo}
          hint={t('register.hints.pseudo')}
          maxLength={15}
          isValid={isFieldValid('pseudo')}
        >
          <span
            className={`float-right text-xs font-normal ${
              pseudoLength > 0 && (pseudoLength < 3 || pseudoLength > 15)
                ? 'text-red-500'
                : pseudoLength > 0
                  ? 'text-green-500'
                  : 'text-text-secondary'
            }`}
          >
            {pseudoLength}/15
          </span>
        </Input>
      </div>

      <div className="mb-4">
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          label={t('register.fields.email')}
          required
          error={errors.email}
          isValid={isFieldValid('email')}
        />
      </div>

      <div className="mb-4">
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          label={t('register.fields.password')}
          required
          error={errors.password}
          isValid={isFieldValid('password')}
        />
        {formData.password && <PasswordStrengthIndicator password={formData.password} />}
      </div>

      <div className="mb-4">
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          label={t('register.fields.phone')}
          required
          error={errors.phone}
          placeholder={t('register.placeholders.phone')}
          isValid={isFieldValid('phone')}
        />
      </div>

      <div className="mb-6">
        <Input
          id="birthday"
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          label={t('register.fields.birthday')}
          required
          error={errors.birthday}
          isValid={isFieldValid('birthday')}
        >
          {age !== null && (
            <span className="float-right text-xs font-normal text-primary">
              ({t('register.age', { age })})
            </span>
          )}
        </Input>
      </div>

      <Button type="submit" loading={mutation.isPending}>
        {mutation.isPending ? t('register.submitting') : t('register.submit')}
      </Button>
    </form>
  )
}

export default RegisterForm
