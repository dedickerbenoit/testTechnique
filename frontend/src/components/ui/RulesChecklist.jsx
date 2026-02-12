import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/16/solid'

function RulesChecklist({ rules }) {
  return (
    <ul className="space-y-1">
      {rules.map((rule) => (
        <li key={rule.label} className="flex items-center gap-1.5 text-xs">
          {rule.loading ? (
            <svg className="w-3.5 h-3.5 text-gray-400 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : rule.test ? (
            <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <XCircleIcon className="w-3.5 h-3.5 text-gray-300" />
          )}
          <span className={rule.loading ? 'text-text-secondary' : rule.test ? 'text-green-600' : 'text-text-secondary'}>
            {rule.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default RulesChecklist
