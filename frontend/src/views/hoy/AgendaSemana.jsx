import { useEffect, useState } from 'react'
import ErrorMsg from '../../components/ErrorMsg.jsx'
import { actividades, bloques } from '../../api.js'
import { addDays, DIAS, hoy, inicioSemana, isoDate, parseIsoDate } from '../../lib/dates.js'

export default function AgendaSemana({ onSelectDay }) {
  const [planes, setPlanes] = useState(null)
  const [acts, setActs] = useState(null)
  const [error, setError] = useState(false)

  const lunes = inicioSemana(hoy())
  const desde = isoDate(lunes)
  const hasta = isoDate(addDays(lunes, 6))

  const cargar = () => {
    Promise.all([bloques.list(), actividades.list({ desde, hasta })]).then(([bs, as]) => {
      setError(false)
      setPlanes(bs)
      setActs(as)
    }).catch(() => setError(true))
  }

  useEffect(cargar, [desde, hasta])

  if (error) return <ErrorMsg onRetry={cargar} />
  if (!planes || !acts) return <div className="empty">Cargando semana…</div>

  const hoyIdx = (hoy().getDay() + 6) % 7

  return (
    <div className="agenda-scroll">
    <div className="agenda-week-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 10 }}>
      {DIAS.map((d, i) => {
        const esHoy = i === hoyIdx
        const bs = planes.filter((b) => b.dia === i)
        const as = acts.filter((a) => (parseIsoDate(a.fecha).getDay() + 6) % 7 === i)
        return (
          <div key={d} style={{ border: '1px solid ' + (esHoy ? 'var(--accent)' : 'var(--border)'), borderRadius: 12, padding: 12, background: esHoy ? 'var(--accent-tint)' : 'var(--surface-2)', minHeight: 150 }}>
            <button onClick={() => onSelectDay?.(addDays(lunes, i))}
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', font: 'inherit', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 10, color: esHoy ? 'var(--accent)' : 'var(--text)' }}>
              {d}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {bs.length === 0 && as.length === 0 && <div className="muted" style={{ fontSize: 11.5 }}>—</div>}
              {bs.map((b) => (
                <div key={'b' + b.id} style={{ fontSize: 11.5, padding: '6px 8px', borderRadius: 7, background: 'var(--surface)', border: '1px solid var(--border)', lineHeight: 1.3 }}>{b.texto}</div>
              ))}
              {as.map((a) => (
                <div key={'a' + a.id} className="row" style={{ gap: 6, fontSize: 11.5, padding: '6px 8px', borderRadius: 7, background: 'var(--surface)', border: '1px solid var(--border-strong)', lineHeight: 1.3, textDecoration: a.done ? 'line-through' : 'none', color: a.done ? 'var(--muted)' : 'var(--text)' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{a.hora}</span>
                  <span>{a.actividad}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
    </div>
  )
}
