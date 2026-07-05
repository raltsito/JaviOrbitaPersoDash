import { useEffect, useState } from 'react'
import Card from '../../components/Card.jsx'
import ErrorMsg from '../../components/ErrorMsg.jsx'
import Icon from '../../components/Icon.jsx'
import Modal from '../../components/Modal.jsx'
import { accesos } from '../../api.js'

const ICONOS_ACCESO = ['ai', 'spark', 'music', 'play', 'design', 'calendar', 'fire', 'hoy', 'analisis', 'habitos', 'conexiones', 'objetivos', 'ajustes', 'logout', 'print', 'edit']

const ACCESO_NUEVO = { nombre: 'Nuevo acceso', url: 'https://', icono: 'spark', color: '#7c5cfc' }

export default function Accesos() {
  const [items, setItems] = useState(null)
  const [editando, setEditando] = useState(false)
  const [error, setError] = useState(false)

  const cargar = () => {
    accesos.list().then((data) => { setError(false); setItems(data) }).catch(() => setError(true))
  }

  useEffect(cargar, [])

  if (error) {
    return (
      <Card title="Accesos rápidos" sub="Tus herramientas, a un clic" icon="spark" iconColor="violet">
        <ErrorMsg onRetry={cargar} />
      </Card>
    )
  }

  if (!items) {
    return (
      <Card title="Accesos rápidos" sub="Tus herramientas, a un clic" icon="spark" iconColor="violet">
        <div className="empty">Cargando…</div>
      </Card>
    )
  }

  const upd = (id, field, val) => setItems((s) => s.map((a) => (a.id === id ? { ...a, [field]: val } : a)))
  const guardar = (id, field, val) => accesos.update(id, { [field]: val }).catch(() => cargar())
  const del = (id) => {
    setItems((s) => s.filter((a) => a.id !== id))
    accesos.remove(id).catch(() => cargar())
  }
  const add = () => accesos.create(ACCESO_NUEVO).then((a) => setItems((s) => [...s, a])).catch(() => {})

  return (
    <Card title="Accesos rápidos" sub="Tus herramientas, a un clic" icon="spark" iconColor="violet"
      right={<button className="icon-btn" title="Editar accesos" onClick={() => setEditando(true)}><Icon name="edit" size={16} /></button>}>
      <div className="launchers">
        {items.map((a) => (
          <a key={a.id} className="launcher" href={a.url} target="_blank" rel="noreferrer">
            <span className="lch-ico" style={{ background: `color-mix(in srgb, ${a.color} 16%, transparent)`, color: a.color }}>
              <Icon name={a.icono} size={24} />
            </span>
            <span>{a.nombre}</span>
          </a>
        ))}
        {items.length === 0 && <div className="empty">Sin accesos. Pulsa editar para añadir uno.</div>}
      </div>

      {editando && (
        <Modal title="Editar accesos rápidos" onClose={() => setEditando(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map((a) => <AccesoRow key={a.id} a={a} onUpdate={upd} onSave={guardar} onDelete={del} />)}
            <button className="btn subtle" onClick={add}><Icon name="plus" size={14} /> Nuevo acceso</button>
          </div>
        </Modal>
      )}
    </Card>
  )
}

function AccesoRow({ a, onUpdate, onSave, onDelete }) {
  const [picker, setPicker] = useState(false)

  return (
    <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
      <div className="row" style={{ gap: 8 }}>
        <button className="icon-btn" onClick={() => setPicker((v) => !v)} title="Elegir icono"
          style={{ background: `color-mix(in srgb, ${a.color} 16%, transparent)`, color: a.color, borderColor: 'transparent', flex: '0 0 auto' }}>
          <Icon name={a.icono} size={18} />
        </button>
        <input className="inp" placeholder="Nombre" value={a.nombre} style={{ flex: 1 }}
          onChange={(e) => onUpdate(a.id, 'nombre', e.target.value)} onBlur={(e) => onSave(a.id, 'nombre', e.target.value)} />
        <input type="color" value={a.color} title="Color"
          style={{ width: 38, height: 38, padding: 2, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)', flex: '0 0 auto' }}
          onChange={(e) => { onUpdate(a.id, 'color', e.target.value); onSave(a.id, 'color', e.target.value) }} />
        <button className="icon-btn" onClick={() => onDelete(a.id)} title="Eliminar"><Icon name="trash" size={15} /></button>
      </div>
      <input className="inp" placeholder="https://" value={a.url} style={{ marginTop: 8 }}
        onChange={(e) => onUpdate(a.id, 'url', e.target.value)} onBlur={(e) => onSave(a.id, 'url', e.target.value)} />
      {picker && (
        <div className="icon-picker" style={{ marginTop: 8 }}>
          {ICONOS_ACCESO.map((i) => (
            <button key={i} className={i === a.icono ? 'on' : ''} title={i}
              onClick={() => { onUpdate(a.id, 'icono', i); onSave(a.id, 'icono', i); setPicker(false) }}>
              <Icon name={i} size={16} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
