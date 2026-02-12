import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { useTranslation } from 'react-i18next'

function PasswordStrengthIndicator({ password }) {
  const { t } = useTranslation()

  const rules = [
    { key: 'minLength', test: password.length >= 8 },
    { key: 'uppercase', test: /[A-Z]/.test(password) },
    { key: 'lowercase', test: /[a-z]/.test(password) },
    { key: 'digit', test: /[0-9]/.test(password) },
    { key: 'special', test: /[^a-zA-Z0-9]/.test(password) },
  ]

  const passedCount = rules.filter((r) => r.test).length

  const getBarColor = () => {
    if (passedCount <= 1) return 'bg-red-500'
    if (passedCount <= 2) return 'bg-orange-500'
    if (passedCount <= 3) return 'bg-yellow-500'
    if (passedCount <= 4) return 'bg-lime-500'
    return 'bg-green-500'
  }

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < passedCount ? getBarColor() : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <ul className="space-y-1">
        {rules.map((rule) => (
          <li key={rule.key} className="flex items-center gap-1.5 text-xs">
            {rule.test ? (
              <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <XCircleIcon className="w-3.5 h-3.5 text-gray-300" />
            )}
            <span className={rule.test ? 'text-green-600' : 'text-text-secondary'}>
              {t(`register.passwordRules.${rule.key}`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PasswordStrengthIndicator
