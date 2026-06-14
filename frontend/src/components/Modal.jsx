import { useEffect } from 'react'
import Icon from './Icon.jsx'

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-h">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} title="Cerrar"><Icon name="plus" size={18} style={{ transform: 'rotate(45deg)' }} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
