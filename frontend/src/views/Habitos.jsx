import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import ErrorMsg from '../components/ErrorMsg.jsx'
import Icon from '../components/Icon.jsx'
import { BarChart } from '../components/charts.jsx'
import { tone } from '../lib/tone.js'
import { useApp } from '../context/AppContext.jsx'
import { analisis, autocuidado, habitos } from '../api.js'
import { diaCorto, parseIsoDate } from '../lib/dates.js'

function semaforo(h, hist) {
  const dias = hist.length
  const ok = hist.filter((v) => (h.tipo === 'sino' ? v >= 1 : h.mejor_mas ? v >= h.objetivo : v <= h.objetivo)).length
  const ratio = dias ? ok / dias : 0
  if (ratio >= 0.7) return { color: 'green', label: 'En meta', txt: `${ok}/${dias} días` }
  if (ratio >= 0.4) return { color: 'amber', label: 'A medias', txt: `${ok}/${dias} días` }
  return { color: 'red', label: 'Atención', txt: `${ok}/${dias} días` }
}

export default function VistaHabitos() {
  const { navigate } = useApp()
  const [items, setItems] = useState(null)
  const [datos, setDatos] = useState(null)
  const [auto, setAuto] = useState([])
  const [error, setError] = useState(false)

  const cargar = () => {
    Promise.all([habitos.list({ activo: 'true' }), analisis.get()]).then(([hs, an]) => {
      setError(false)
      setItems(hs.map((h) => ({ ...h, objetivo: parseFloat(h.objetivo), paso: parseFloat(h.paso) })))
      setDatos(an)
      autocuidado.list({ desde: an.dias[0], hasta: an.dias[an.dias.length - 1] }).then(setAuto)
    }).catch(() => setError(true))
  }

  useEffect(cargar, [])

  if (error) return <ErrorMsg onRetry={cargar} />
  if (!items || !datos) return <div className="empty">Cargando…</div>

  const labels = datos.dias.map((d) => diaCorto(parseIsoDate(d)))
  const hist = datos.hist_habitos
  const semaforos = items.map((h) => semaforo(h, hist[h.id] || []))
  const contar = (c) => semaforos.filter((s) => s.color === c).length

  return (
    <div className="view grid" style={{ gap: 'var(--gap)' }}>
      <div className="row between wrap" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow">Hábitos</div>
          <h1 style={{ fontSize: 24, marginTop: 4 }}>Tus hábitos esta semana</h1>
        </div>
        <button className="btn ghost" onClick={() => navigate('hoy')}><Icon name="edit" size={15} /> Registrar en el tracker</button>
      </div>

      {/* resumen semáforo */}
      <div className="grid habitos-resumen-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--gap)' }}>
        {[['green', 'En meta', contar('green')], ['amber', 'A medias', contar('amber')], ['red', 'Necesitan atención', contar('red')]].map(([c, l, n]) => (
          <Card key={l} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="dot" style={{ width: 16, height: 16, background: tone(c), boxShadow: `0 0 12px ${tone(c)}` }} />
            <div className="kpi"><span className="n" style={{ fontSize: 26 }}>{n}</span><span className="l">{l}</span></div>
          </Card>
        ))}
      </div>

      {/* tarjetas por hábito */}
      {items.length === 0 ? (
        <Card><div className="empty">Sin hábitos activos. Agrégalos en Ajustes.</div></Card>
      ) : (
        <div className="grid habitos-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', gap: 'var(--gap)' }}>
          {items.map((h, i) => {
            const series = hist[h.id] || []
            const sem = semaforos[i]
            const prom = series.length ? series.reduce((a, b) => a + b, 0) / series.length : 0
            return (
              <Card key={h.id}>
                <div className="card-h">
                  <span className="habit-ico" style={{ background: `color-mix(in srgb, ${tone(h.color)} 16%, transparent)`, color: tone(h.color) }}><Icon name={h.icono} size={19} /></span>
                  <div>
                    <h3>{h.nombre}</h3>
                    <div className="sub">{h.tipo === 'sino' ? 'Objetivo diario' : (h.mejor_mas ? 'Meta ' : 'Máx ') + h.objetivo + (h.unidad ? ' ' + h.unidad : '')}</div>
                  </div>
                  <span className="spacer pill" style={{ marginLeft: 'auto', background: `color-mix(in srgb, ${tone(sem.color)} 16%, transparent)`, color: tone(sem.color) }}>
                    <span className="dot" style={{ background: tone(sem.color) }} /> {sem.label}
                  </span>
                </div>
                <BarChart data={series} labels={labels} color={h.color} target={h.tipo === 'sino' ? 1 : h.objetivo} height={120} />
                <div className="row between" style={{ marginTop: 12, fontSize: 12.5 }}>
                  <span className="muted">Media: <strong style={{ color: 'var(--text)' }}>{h.tipo === 'sino' ? Math.round(prom * 100) + '%' : prom.toFixed(1) + (h.unidad ? ' ' + h.unidad : '')}</strong></span>
                  <span className="muted">{sem.txt}</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* autocuidado registrado */}
      <Card title="Autocuidado registrado" sub="Actividades adicionales del tracker" icon="fire" iconColor="amber">
        {auto.filter((a) => a.texto).length === 0
          ? <div className="empty">Las actividades de autocuidado que registres en el tracker aparecerán aquí.</div>
          : <div className="row wrap" style={{ gap: 10 }}>
            {auto.filter((a) => a.texto).map((a) => (
              <span key={a.id} className="pill" style={{ padding: '8px 14px', background: a.done ? 'color-mix(in srgb, var(--green) 14%, transparent)' : 'var(--surface-2)', color: a.done ? 'var(--green)' : 'var(--muted)', border: '1px solid var(--border)' }}>
                {a.done && <Icon name="check" size={13} color="var(--green)" />} {a.texto}
              </span>
            ))}
          </div>}
      </Card>
    </div>
  )
}
