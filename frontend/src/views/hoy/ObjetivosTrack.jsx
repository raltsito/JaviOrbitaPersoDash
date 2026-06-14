import { useEffect, useState } from 'react'
import Card from '../../components/Card.jsx'
import ErrorMsg from '../../components/ErrorMsg.jsx'
import Icon from '../../components/Icon.jsx'
import { tone } from '../../lib/tone.js'
import { CATEGORIAS, PERIODOS } from '../../lib/categorias.js'
import { useApp } from '../../context/AppContext.jsx'
import { objetivos } from '../../api.js'

export default function ObjetivosTrack() {
  const { navigate } = useApp()
  const [per, setPer] = useState('diario')
  const [items, setItems] = useState(null)
  const [error, setError] = useState(false)

  const cargar = () => {
    objetivos.list({ periodo: per, activo: 'true' }).then((data) => { setError(false); setItems(data) }).catch(() => setError(true))
  }

  useEffect(cargar, [per])

  const bump = (id, dir) => {
    const o = items.find((x) => x.id === id)
    const progreso = Math.max(0, Math.min(100, o.progreso + dir * 10))
    setItems((it) => it.map((x) => (x.id === id ? { ...x, progreso } : x)))
    objetivos.update(id, { progreso })
  }

  return (
    <Card title="Objetivos" sub="Marca avance y edición" icon="objetivos" iconColor="violet"
      right={<button className="btn ghost" onClick={() => navigate('objetivos')}>Ver todos <Icon name="chevron" size={14} /></button>}>
      <div className="row wrap" style={{ gap: 8, marginBottom: 16 }}>
        {PERIODOS.map((p) => <button key={p.k} className={'chip' + (per === p.k ? ' on' : '')} onClick={() => setPer(p.k)}>{p.l}</button>)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {error && <ErrorMsg onRetry={cargar} />}
        {!items && !error && <div className="empty">Cargando…</div>}
        {items && items.length === 0 && <div className="empty">Sin objetivos en este periodo.</div>}
        {items && items.map((o) => {
          const cat = CATEGORIAS[o.categoria]
          return (
            <div key={o.id} style={{ padding: 12, borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div className="row between" style={{ marginBottom: 8 }}>
                <div className="row" style={{ gap: 8 }}>
                  <span className="dot" style={{ background: tone(cat.color) }} />
                  <strong style={{ fontSize: 13.5 }}>{o.titulo}</strong>
                </div>
                <span className="pill" style={{ background: `color-mix(in srgb, ${tone(cat.color)} 14%, transparent)`, color: tone(cat.color) }}>{cat.label}</span>
              </div>
              <div className="row" style={{ gap: 10 }}>
                <div className="progress" style={{ flex: 1 }}><i style={{ width: o.progreso + '%', background: tone(cat.color) }} /></div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, minWidth: 38, textAlign: 'right' }}>{o.progreso}%</span>
                <button className="step-btn" style={{ width: 28, height: 28 }} onClick={() => bump(o.id, -1)}><Icon name="minus" size={13} /></button>
                <button className="step-btn" style={{ width: 28, height: 28 }} onClick={() => bump(o.id, 1)}><Icon name="plus" size={13} /></button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
