import { useEffect, useState } from 'react'
import Check from '../../components/Check.jsx'
import ErrorMsg from '../../components/ErrorMsg.jsx'
import Icon from '../../components/Icon.jsx'
import { actividades } from '../../api.js'
import { isoDate } from '../../lib/dates.js'

export default function AgendaDia({ fecha, onChange }) {
  const [filas, setFilas] = useState(null)
  const [error, setError] = useState(false)
  const f = isoDate(fecha)

  const cargar = () => {
    actividades.list({ fecha: f }).then((data) => { setError(false); setFilas(data) }).catch(() => setError(true))
  }

  useEffect(cargar, [f])

  if (error) return <ErrorMsg onRetry={cargar} />
  if (!filas) return <div className="empty">Cargando agenda…</div>

  const upd = (id, field, val) => setFilas((fs) => fs.map((r) => (r.id === id ? { ...r, [field]: val } : r)))
  const guardar = (id, field, val) => actividades.update(id, { [field]: val }).catch(() => {})

  const toggle = (id) => {
    const r = filas.find((x) => x.id === id)
    const done = !r.done
    upd(id, 'done', done)
    actividades.update(id, { done }).then(() => onChange?.())
  }

  const del = (id) => {
    setFilas((fs) => fs.filter((x) => x.id !== id))
    actividades.remove(id).then(() => onChange?.())
  }

  const add = () => {
    actividades.create({ fecha: f, hora: '12:00', actividad: 'Nueva actividad', done: false, notas: '' })
      .then((r) => { setFilas((fs) => [...fs, r]); onChange?.() })
  }

  return (
    <div className="agenda-scroll">
    <table className="agenda">
      <thead><tr>
        <th style={{ width: 70 }}>Hora</th><th>Actividad</th>
        <th style={{ width: 44, textAlign: 'center' }}>✓</th><th style={{ width: '34%' }}>Notas</th><th style={{ width: 34 }}></th>
      </tr></thead>
      <tbody>
        {filas.map((r) => (
          <tr key={r.id} className={r.done ? 'done' : ''}>
            <td><input className="inp" style={{ background: 'transparent', padding: '4px 6px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--accent)', width: 62 }}
              value={r.hora} onChange={(e) => upd(r.id, 'hora', e.target.value)} onBlur={(e) => guardar(r.id, 'hora', e.target.value)} /></td>
            <td><input className="inp actv" style={{ background: 'transparent', padding: '4px 6px', fontWeight: 600 }}
              value={r.actividad} onChange={(e) => upd(r.id, 'actividad', e.target.value)} onBlur={(e) => guardar(r.id, 'actividad', e.target.value)} /></td>
            <td style={{ textAlign: 'center' }}><div style={{ display: 'inline-block' }}><Check on={r.done} onClick={() => toggle(r.id)} size={22} /></div></td>
            <td><input className="inp" style={{ background: 'transparent', padding: '4px 6px', color: 'var(--muted)' }} placeholder="Añade una nota…"
              value={r.notas} onChange={(e) => upd(r.id, 'notas', e.target.value)} onBlur={(e) => guardar(r.id, 'notas', e.target.value)} /></td>
            <td><button className="icon-btn" style={{ width: 30, height: 30, border: 'none', background: 'transparent' }} onClick={() => del(r.id)} title="Eliminar"><Icon name="trash" size={15} /></button></td>
          </tr>
        ))}
        {filas.length === 0 && <tr><td colSpan="5" className="empty">Sin actividades para este día.</td></tr>}
      </tbody>
      <tfoot><tr><td colSpan="5" style={{ paddingTop: 14 }}>
        <button className="btn subtle" onClick={add}><Icon name="plus" size={15} /> Añadir actividad</button>
      </td></tr></tfoot>
    </table>
    </div>
  )
}
