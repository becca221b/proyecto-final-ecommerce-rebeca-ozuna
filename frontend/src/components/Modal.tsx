import { useEffect, useRef, type FormEvent, type ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  submitLabel?: string
  busy?: boolean
}

export function Modal({ title, description, onClose, children, onSubmit, submitLabel = 'Guardar cambios', busy = false }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog ref={dialogRef} className="modal-panel" aria-labelledby="modal-title" onCancel={onClose} onClick={(event) => event.target === event.currentTarget && onClose()}>
      <header className="modal-header">
        <div><h2 id="modal-title">{title}</h2>{description && <p>{description}</p>}</div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar ventana"><X /></button>
      </header>
      {onSubmit ? <form onSubmit={onSubmit}>
        <div className="modal-content">{children}</div>
        <footer className="modal-footer"><button className="button button-quiet" type="button" onClick={onClose}>Cancelar</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Guardando…' : submitLabel}</button></footer>
      </form> : <div className="modal-content">{children}</div>}
    </dialog>
  )
}
