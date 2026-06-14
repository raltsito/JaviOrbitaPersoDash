import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import ErrorMsg from '../components/ErrorMsg.jsx'
import { Ring } from '../components/charts.jsx'
import { tone } from '../lib/tone.js'
import { CATEGORIAS } from '../lib/categorias.js'
import { objetivos } from '../api.js'

const PERIODO_FILTROS = [
  { k: 'todas', l: 'Todas' },
  { k: 'diario', l: 'Diario' },
  { k: 'semanal', l: 'Semanal' },
  { k: 'mes', l: 'Mes' },
  { k: 'año', l: 'Año' },
]

export default function VistaObjetivos() {
  const [periodo, setPeriodo] = useState('todas')
  const [items, setItems] = useState(null)
  const [error, setError] = useState(false)

  const cargar = () => {
    const params = periodo === 'todas' ? { activo: 'true' } : { periodo, activo: 'true' }
    objetivos.list(params).then((data) => { setError(false); setItems(data) }).catch(() => setError(true))
  }

  useEffect(cargar, [periodo])

  return (
    <div className="view grid" style={{ gap: 'var(--gap)' }}>
      <div className="row between wrap" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow">Objetivos</div>
          <h1 style={{ fontSize: 24, marginTop: 4 }}>Hacia dónde apuntas</h1>
          <div className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Tu avance por área de vida.</div>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          {PERIODO_FILTROS.map((p) => <button key={p.k} className={'chip' + (periodo === p.k ? ' on' : '')} onClick={() => setPeriodo(p.k)}>{p.l}</button>)}
        </div>
      </div>

      {error && <ErrorMsg onRetry={cargar} />}
      {!items && !error && <div className="empty">Cargando…</div>}

      {items && (
        <div className="grid objetivos-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--gap)' }}>
          {Object.entries(CATEGORIAS).map(([k, c]) => {
            const lst = items.filter((o) => o.categoria === k)
            const avg = lst.length ? Math.round(lst.reduce((a, o) => a + o.progreso, 0) / lst.length) : 0
            return (
              <Card key={k} title={c.label} sub={lst.length + (lst.length === 1 ? ' objetivo' : ' objetivos')} icon="objetivos" iconColor={c.color}
                right={<Ring value={avg} size={64} stroke={7} color={c.color} />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {lst.length === 0 && <div className="empty">Sin objetivos en esta categoría.</div>}
                  {lst.map((o) => (
                    <div key={o.id}>
                      <div className="row between" style={{ marginBottom: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{o.titulo}</span>
                        <span className="muted" style={{ fontSize: 11.5, textTransform: 'capitalize' }}>{o.periodo}</span>
                      </div>
                      <div className="row" style={{ gap: 10 }}>
                        <div className="progress" style={{ flex: 1 }}><i style={{ width: o.progreso + '%', background: tone(c.color) }} /></div>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, minWidth: 34, textAlign: 'right' }}>{o.progreso}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
