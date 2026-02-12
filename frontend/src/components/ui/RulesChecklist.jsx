import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/16/solid'

function RulesChecklist({ rules }) {
  return (
    <ul className="space-y-1">
      {rules.map((rule) => (
        <li key={rule.label} className="flex items-center gap-1.5 text-xs">
          {rule.test ? (
            <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <XCircleIcon className="w-3.5 h-3.5 text-gray-300" />
          )}
          <span className={rule.test ? 'text-green-600' : 'text-text-secondary'}>
            {rule.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default RulesChecklist
