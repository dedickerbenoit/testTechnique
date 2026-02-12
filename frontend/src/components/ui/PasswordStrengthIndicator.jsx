import { useTranslation } from 'react-i18next'
import RulesChecklist from './RulesChecklist'

function PasswordStrengthIndicator({ password, personalInfo = {} }) {
  const { t } = useTranslation()

  const containsPersonalInfo = () => {
    if (!password) return false
    const lower = password.toLowerCase()
    const values = [
      personalInfo.last_name,
      personalInfo.first_name,
      personalInfo.pseudo,
    ]

    if (personalInfo.birthday) {
      const date = new Date(personalInfo.birthday)
      if (!isNaN(date)) {
        const year = String(date.getFullYear())
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        values.push(year, `${day}${month}${year}`, `${day}${month}`)
      }
    }

    return values.some((v) => v && v.length >= 2 && lower.includes(v.toLowerCase()))
  }

  const rules = [
    { label: t('register.passwordRules.minLength'), test: password.length >= 8 },
    { label: t('register.passwordRules.uppercase'), test: /[A-Z]/.test(password) },
    { label: t('register.passwordRules.lowercase'), test: /[a-z]/.test(password) },
    { label: t('register.passwordRules.digit'), test: /[0-9]/.test(password) },
    { label: t('register.passwordRules.special'), test: /[^a-zA-Z0-9]/.test(password) },
    { label: t('register.passwordRules.noPersonalInfo'), test: !containsPersonalInfo() },
  ]

  const passedCount = rules.filter((r) => r.test).length

  const getBarColor = () => {
    if (passedCount <= 1) return 'bg-red-500'
    if (passedCount <= 2) return 'bg-orange-500'
    if (passedCount <= 3) return 'bg-yellow-500'
    if (passedCount <= 4) return 'bg-lime-500'
    if (passedCount <= 5) return 'bg-green-400'
    return 'bg-green-500'
  }

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < passedCount ? getBarColor() : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <RulesChecklist rules={rules} />
    </div>
  )
}

export default PasswordStrengthIndicator
