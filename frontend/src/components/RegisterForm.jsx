import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { registerUser, checkPseudoAvailability } from '../services/userService'
import useDebounce from '../hooks/useDebounce'
import Input from './ui/Input'
import Button from './ui/Button'
import PasswordStrengthIndicator from './ui/PasswordStrengthIndicator'
import PseudoRulesIndicator from './ui/PseudoRulesIndicator'

const PHONE_COUNTRIES = [
  { code: 'FR', dial: '+33', flag: '\u{1F1EB}\u{1F1F7}', pattern: /^0[67]\d{8}$/, placeholder: '0612345678' },
  { code: 'BE', dial: '+32', flag: '\u{1F1E7}\u{1F1EA}', pattern: /^0[4-9]\d{7,8}$/, placeholder: '0471234567' },
  { code: 'CH', dial: '+41', flag: '\u{1F1E8}\u{1F1ED}', pattern: /^0[7]\d{8}$/, placeholder: '0791234567' },
  { code: 'LU', dial: '+352', flag: '\u{1F1F1}\u{1F1FA}', pattern: /^\d{6,9}$/, placeholder: '621123456' },
]

function RegisterForm() {
  const { t } = useTranslation()

  const [phoneCountry, setPhoneCountry] = useState('FR')

  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    pseudo: '',
    email: '',
    password: '',
    phone: '',
    birthday: '',
  })

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [pseudoAvailable, setPseudoAvailable] = useState(null)
  const [pseudoChecking, setPseudoChecking] = useState(false)

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const debouncedPseudo = useDebounce(formData.pseudo, 500)

  useEffect(() => {
    if (!debouncedPseudo || debouncedPseudo.length < 3) {
      setPseudoAvailable(null)
      setPseudoChecking(false)
      return
    }

    setPseudoChecking(true)
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
      .finally(() => setPseudoChecking(false))
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
      setAvatarFile(null)
      setAvatarPreview(null)
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: t('register.errors.avatar.type') }))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: t('register.errors.avatar.size') }))
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, avatar: '' }))
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
    } else {
      const country = PHONE_COUNTRIES.find((c) => c.code === phoneCountry)
      if (!country.pattern.test(formData.phone)) {
        newErrors.phone = t('register.errors.phone.invalid')
      }
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

    const payload = new FormData()
    Object.keys(formData).forEach((key) => payload.append(key, formData[key]))
    payload.append('phone_country', phoneCountry)
    if (avatarFile) payload.append('avatar', avatarFile)

    mutation.mutate(payload)
  }

  const isFieldValid = (name) => {
    if (!formData[name]) return false
    if (errors[name]) return false

    switch (name) {
      case 'last_name':
      case 'first_name':
        return formData[name].trim().length > 0
      case 'pseudo':
        return formData[name].length >= 3 && formData[name].length <= 15 && pseudoAvailable === true
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[name])
      case 'password': {
        const p = formData[name]
        return p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^a-zA-Z0-9]/.test(p)
      }
      case 'phone': {
        const country = PHONE_COUNTRIES.find((c) => c.code === phoneCountry)
        return country.pattern.test(formData[name])
      }
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

      <div className="flex gap-4 mb-4">
        <div className="flex-1 flex flex-col gap-4">
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
        <div className="flex flex-col items-center justify-center">
          <label htmlFor="avatar" className="cursor-pointer">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 hover:border-primary flex items-center justify-center overflow-hidden transition-colors">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-text-secondary text-center px-1">{t('register.fields.avatar')}</span>
              )}
            </div>
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/jpeg,image/png"
            onChange={handleAvatarChange}
            className="sr-only"
          />
          {errors.avatar && (
            <p role="alert" className="mt-1 text-xs text-red-500 text-center max-w-24">
              {errors.avatar}
            </p>
          )}
        </div>
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
        {formData.pseudo && <PseudoRulesIndicator pseudo={formData.pseudo} pseudoAvailable={pseudoAvailable} pseudoChecking={pseudoChecking} />}
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
        {formData.password && <PasswordStrengthIndicator password={formData.password} personalInfo={formData} />}
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1">
          {t('register.fields.phone')} <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <select
            value={phoneCountry}
            onChange={(e) => {
              setPhoneCountry(e.target.value)
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
            }}
            className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-sm"
            aria-label={t('register.fields.phoneCountry')}
          >
            {PHONE_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.dial}
              </option>
            ))}
          </select>
          <div className="flex-1">
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder={PHONE_COUNTRIES.find((c) => c.code === phoneCountry)?.placeholder}
              isValid={isFieldValid('phone')}
            />
          </div>
        </div>
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
