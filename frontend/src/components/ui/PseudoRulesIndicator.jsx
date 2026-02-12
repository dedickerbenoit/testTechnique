import { useTranslation } from 'react-i18next'
import RulesChecklist from './RulesChecklist'

function PseudoRulesIndicator({ pseudo, pseudoAvailable, pseudoChecking }) {
  const { t } = useTranslation()

  const rules = [
    { label: t('register.pseudoRules.length'), test: pseudo.length >= 3 && pseudo.length <= 15 },
    { label: t('register.pseudoRules.available'), test: pseudoAvailable === true, loading: pseudoChecking },
  ]

  return (
    <div className="mt-2">
      <RulesChecklist rules={rules} />
    </div>
  )
}

export default PseudoRulesIndicator
