import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { errorMessage } from '../api'

type FeedbackProps = { error?: unknown; success?: string; onDismiss?: () => void }

export function Feedback({ error, success, onDismiss }: FeedbackProps) {
  if (!error && !success) return null
  return <div className={`feedback ${error ? 'feedback-error' : 'feedback-success'}`} role={error ? 'alert' : 'status'}>
    {error ? <AlertCircle aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
    <span>{error ? errorMessage(error) : success}</span>
    {onDismiss && <button type="button" className="feedback-close" onClick={onDismiss} aria-label="Cerrar aviso">×</button>}
  </div>
}
