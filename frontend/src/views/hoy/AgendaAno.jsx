import { useEffect, useState } from 'react'
import ErrorMsg from '../../components/ErrorMsg.jsx'
import { analisis } from '../../api.js'
import { MESES, hoy } from '../../lib/dates.js'

export default function AgendaAno() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(false)

  const cargar = () => {
    analisis.get().then((d) => { setError(false); setDatos(d) }).catch(() => setError(true))
  }

  useEffect(cargar, [])

  if (error) return <ErrorMsg onRetry={cargar} />
  if (!datos) return <div className="empty">Cargando…</div>

  const cur = hoy().getMonth()
  const vals = datos.actividades_por_mes
  const mx = Math.max(...vals, 1)

  return (
    <div className="agenda-scroll">
    <div className="agenda-year-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
      {MESES.map((mes, i) => (
        <div key={mes} style={{ border: '1px solid ' + (i === cur ? 'var(--accent)' : 'var(--border)'), borderRadius: 11, padding: 12, background: i === cur ? 'var(--accent-tint)' : 'var(--surface-2)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize', marginBottom: 8, color: i === cur ? 'var(--accent)' : 'var(--text)' }}>{mes.slice(0, 3)}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{i <= cur ? vals[i] : '—'}</div>
          <div style={{ height: 5, borderRadius: 9, background: 'var(--surface-3)', marginTop: 8, overflow: 'hidden' }}>
            <i style={{ display: 'block', height: '100%', width: `${i <= cur ? (vals[i] / mx) * 100 : 0}%`, background: 'var(--accent)', borderRadius: 9 }} />
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}
