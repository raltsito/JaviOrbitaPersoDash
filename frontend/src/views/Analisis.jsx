import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import ErrorMsg from '../components/ErrorMsg.jsx'
import Icon from '../components/Icon.jsx'
import { BarChart, LineChart } from '../components/charts.jsx'
import { tone } from '../lib/tone.js'
import { CATEGORIAS } from '../lib/categorias.js'
import { analisis, objetivos, resumen } from '../api.js'
import { diaCorto, MESES, parseIsoDate } from '../lib/dates.js'

const PERIODO_OBJETIVO = { semana: 'semanal', mes: 'mes', año: 'año' }

function promedio(lst) {
  if (!lst.length) return 0
  return Math.round(lst.reduce((a, o) => a + o.progreso, 0) / lst.length)
}

export default function VistaAnalisis() {
  const [per, setPer] = useState('semana')
  const [datos, setDatos] = useState(null)
  const [res, setRes] = useState(null)
  const [objs, setObjs] = useState(null)
  const [error, setError] = useState(false)

  const cargar = () => {
    Promise.all([analisis.get(), resumen.hoy(), objetivos.list({ activo: 'true' })])
      .then(([d, r, o]) => { setError(false); setDatos(d); setRes(r); setObjs(o) })
      .catch(() => setError(true))
  }

  useEffect(cargar, [])

  if (error) return <ErrorMsg onRetry={cargar} />
  if (!datos || !res || !objs) return <div className="empty">Cargando…</div>

  const pctDia = res.actividades.pct
  const porPeriodo = promedio(objs.filter((o) => o.periodo === PERIODO_OBJETIVO[per]))
  const actividadesAno = datos.actividades_por_mes.reduce((a, b) => a + b, 0)

  const labelsSemana = datos.dias.map((d) => diaCorto(parseIsoDate(d)))
  const labelsMes = MESES.map((m) => m.slice(0, 1).toUpperCase())

  return (
    <div className="view grid" style={{ gap: 'var(--gap)' }}>
      <div className="row between wrap" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow">Análisis</div>
          <h1 style={{ fontSize: 24, marginTop: 4 }}>Tu progreso en cifras</h1>
        </div>
        <div className="seg">{[['semana', 'Semana'], ['mes', 'Mes'], ['año', 'Año']].map(([k, l]) => <button key={k} className={per === k ? 'on' : ''} onClick={() => setPer(k)}>{l}</button>)}</div>
      </div>

      {/* KPIs */}
      <div className="grid analisis-kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        {[
          { n: pctDia + '%', l: 'Día completado', c: 'violet', ico: 'hoy' },
          { n: porPeriodo + '%', l: 'Objetivos del ' + per, c: 'green', ico: 'objetivos' },
          { n: res.racha, l: 'Días de racha', c: 'amber', ico: 'fire' },
          { n: actividadesAno, l: 'Actividades hechas este año', c: 'blue', ico: 'analisis' },
        ].map((k) => (
          <Card key={k.l} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="habit-ico" style={{ background: `color-mix(in srgb, ${tone(k.c)} 16%, transparent)`, color: tone(k.c) }}><Icon name={k.ico} size={18} /></span>
            <div className="kpi"><span className="n" style={{ color: tone(k.c) }}>{k.n}</span><span className="l">{k.l}</span></div>
          </Card>
        ))}
      </div>

      <div className="grid analisis-grid" style={{ gridTemplateColumns: '1.4fr 1fr', gap: 'var(--gap)', alignItems: 'start' }}>
        {/* gráfica principal */}
        <Card title={per === 'semana' ? 'Actividades completadas por día' : per === 'mes' ? 'Cumplimiento mensual' : 'Actividades por mes'}
          sub={per === 'semana' ? 'Últimos 7 días (%)' : per === 'mes' ? '% de actividades completadas' : 'Conteo anual'} icon="analisis" iconColor="violet">
          {per === 'semana' && <BarChart data={datos.actividades_7dias.map((d) => d.pct)} labels={labelsSemana} color="violet" target={80} max={100} height={190} />}
          {per === 'mes' && <LineChart data={datos.pct_actividades_mes} labels={labelsMes} color="green" height={200} />}
          {per === 'año' && <BarChart data={datos.actividades_por_mes} labels={labelsMes} color="blue" height={200} />}
          <div className="row" style={{ gap: 18, marginTop: 14, fontSize: 12 }}>
            <span className="row" style={{ gap: 6 }}><span className="dot" style={{ background: 'var(--accent)' }} /> Logrado</span>
            {per === 'semana' && <span className="row" style={{ gap: 6 }}><span style={{ width: 16, height: 0, borderTop: '2px dashed var(--border-strong)' }} /> Meta</span>}
          </div>
        </Card>

        {/* objetivos por categoría */}
        <Card title="Por categoría de vida" sub="Avance medio" icon="objetivos" iconColor="green">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(CATEGORIAS).map(([k, c]) => {
              const avg = promedio(objs.filter((o) => o.categoria === k))
              return (
                <div key={k}>
                  <div className="row between" style={{ marginBottom: 6 }}>
                    <span className="row" style={{ gap: 8 }}><span className="dot" style={{ background: tone(c.color) }} /><strong style={{ fontSize: 13 }}>{c.label}</strong></span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{avg}%</span>
                  </div>
                  <div className="progress"><i style={{ width: avg + '%', background: tone(c.color) }} /></div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* actividades a lo largo del año */}
      <Card title="Actividades completadas durante el año" sub="% mensual de cumplimiento" icon="analisis" iconColor="blue">
        <LineChart data={datos.pct_actividades_mes} labels={MESES.map((m) => m.slice(0, 3))} color="violet" height={180} />
      </Card>
    </div>
  )
}
