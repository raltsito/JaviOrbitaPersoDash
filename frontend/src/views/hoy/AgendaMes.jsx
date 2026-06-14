import { useEffect, useState } from 'react'
import ErrorMsg from '../../components/ErrorMsg.jsx'
import { actividades } from '../../api.js'
import { DIAS, hoy, isoDate } from '../../lib/dates.js'

export default function AgendaMes({ fechaSeleccionada, onSelectDay }) {
  const [busy, setBusy] = useState({})
  const [error, setError] = useState(false)
  const y = fechaSeleccionada.getFullYear(), m = fechaSeleccionada.getMonth()

  const cargar = () => {
    const desde = new Date(y, m, 1), hasta = new Date(y, m + 1, 0)
    actividades.list({ desde: isoDate(desde), hasta: isoDate(hasta) }).then((items) => {
      const b = {}
      items.forEach((a) => { b[a.fecha] = (b[a.fecha] || 0) + 1 })
      setError(false)
      setBusy(b)
    }).catch(() => setError(true))
  }

  useEffect(cargar, [y, m])

  if (error) return <ErrorMsg onRetry={cargar} />

  const first = (new Date(y, m, 1).getDay() + 6) % 7
  const dias = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let i = 1; i <= dias; i++) cells.push(i)

  const hoyIso = isoDate(hoy())
  const selIso = isoDate(fechaSeleccionada)

  return (
    <div className="agenda-scroll">
    <div className="agenda-month-grid">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 6 }}>
        {DIAS.map((x) => <div key={x} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>{x}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
        {cells.map((c, i) => {
          if (!c) return <div key={i} />
          const iso = isoDate(new Date(y, m, c))
          const esHoy = iso === hoyIso
          const esSel = iso === selIso
          const n = Math.min(busy[iso] || 0, 4)
          return (
            <button key={i} onClick={() => onSelectDay(new Date(y, m, c))}
              style={{
                aspectRatio: '1.1', borderRadius: 9, cursor: 'pointer', textAlign: 'left', width: '100%', margin: 0, font: 'inherit', color: 'inherit',
                border: '1px solid ' + (esHoy || esSel ? 'var(--accent)' : 'var(--border)'),
                background: esSel ? 'var(--accent-tint)' : esHoy ? 'color-mix(in srgb, var(--accent) 6%, var(--surface-2))' : 'var(--surface-2)',
                padding: 7, display: 'flex', flexDirection: 'column',
              }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: (esHoy || esSel) ? 'var(--accent)' : 'var(--text)' }}>{c}</span>
              {n > 0 && <div style={{ marginTop: 'auto', display: 'flex', gap: 2 }}>{Array.from({ length: n }).map((_, k) => <span key={k} style={{ width: 5, height: 5, borderRadius: 9, background: 'var(--accent)' }} />)}</div>}
            </button>
          )
        })}
      </div>
    </div>
    </div>
  )
}
