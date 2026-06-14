import { useEffect, useState } from 'react'
import Card from '../../components/Card.jsx'
import Check from '../../components/Check.jsx'
import ErrorMsg from '../../components/ErrorMsg.jsx'
import Icon from '../../components/Icon.jsx'
import { tone } from '../../lib/tone.js'
import { useApp } from '../../context/AppContext.jsx'
import { autocuidado, habitos, registros } from '../../api.js'
import { hoy, isoDate } from '../../lib/dates.js'

export default function HabitTracker({ onChange }) {
  const { navigate } = useApp()
  const [items, setItems] = useState(null)
  const [auto, setAuto] = useState([])
  const [error, setError] = useState(false)
  const f = isoDate(hoy())

  const cargar = () => {
    Promise.all([habitos.list({ activo: 'true' }), registros.list({ fecha: f }), autocuidado.list({ fecha: f })])
      .then(([hs, regs, ac]) => {
        const valores = {}
        regs.forEach((r) => { valores[r.habito] = parseFloat(r.valor) })
        setError(false)
        setItems(hs.map((h) => ({ ...h, objetivo: parseFloat(h.objetivo), paso: parseFloat(h.paso), hoy: valores[h.id] ?? 0 })))
        setAuto(ac)
      })
      .catch(() => setError(true))
  }

  useEffect(cargar, [f])

  if (error) {
    return (
      <Card title="Habit Tracker" sub="Registra hoy — se vuelca al panel de Hábitos" icon="habitos" iconColor="green">
        <ErrorMsg onRetry={cargar} />
      </Card>
    )
  }

  if (!items) {
    return (
      <Card title="Habit Tracker" sub="Registra hoy — se vuelca al panel de Hábitos" icon="habitos" iconColor="green">
        <div className="empty">Cargando…</div>
      </Card>
    )
  }

  const setVal = (id, v) => {
    const val = Math.max(0, +v.toFixed(2))
    setItems((hs) => hs.map((h) => (h.id === id ? { ...h, hoy: val } : h)))
    registros.upsert({ habito: id, fecha: f, valor: val }).then(() => onChange?.())
  }

  const addAuto = () => autocuidado.create({ fecha: f, texto: '', done: false }).then((a) => setAuto((s) => [...s, a]))
  const updAuto = (id, texto) => setAuto((s) => s.map((a) => (a.id === id ? { ...a, texto } : a)))
  const guardarAuto = (id, texto) => autocuidado.update(id, { texto }).catch(() => {})
  const toggleAuto = (id) => {
    const a = auto.find((x) => x.id === id)
    const done = !a.done
    setAuto((s) => s.map((x) => (x.id === id ? { ...x, done } : x)))
    autocuidado.update(id, { done })
  }
  const delAuto = (id) => {
    setAuto((s) => s.filter((x) => x.id !== id))
    autocuidado.remove(id)
  }

  return (
    <Card title="Habit Tracker" sub="Registra hoy — se vuelca al panel de Hábitos" icon="habitos" iconColor="green"
      right={<a className="btn ghost" href="#" onClick={(e) => { e.preventDefault(); navigate('habitos') }}>Ver panel <Icon name="chevron" size={14} /></a>}>
      <div className="habit-grid">
        {items.map((h) => {
          const pct = h.tipo === 'sino' ? (h.hoy ? 100 : 0) : Math.min((h.hoy / h.objetivo) * 100, 100)
          const ok = h.mejor_mas ? h.hoy >= h.objetivo : h.hoy <= h.objetivo
          return (
            <div key={h.id} className="habit">
              <div className="habit-top">
                <span className="habit-ico" style={{ background: `color-mix(in srgb, ${tone(h.color)} 16%, transparent)`, color: tone(h.color) }}><Icon name={h.icono} size={19} /></span>
                <div>
                  <div className="habit-name">{h.nombre}</div>
                  <div className="habit-obj">{h.tipo === 'sino' ? 'Objetivo diario' : (h.mejor_mas ? 'Objetivo ' : 'Máx ') + h.objetivo + (h.unidad ? ' ' + h.unidad : '')}</div>
                </div>
                {h.tipo !== 'sino' && <div className="habit-val" style={{ color: ok ? tone(h.color) : 'var(--text)' }}>{h.hoy}<small>{h.unidad}</small></div>}
              </div>

              {h.tipo === 'sino' ? (
                <button className={'btn ' + (h.hoy ? '' : 'subtle')} style={{ width: '100%', justifyContent: 'center', background: h.hoy ? tone(h.color) : undefined, boxShadow: h.hoy ? 'var(--glow)' : undefined }} onClick={() => setVal(h.id, h.hoy ? 0 : 1)}>
                  {h.hoy ? <><Icon name="check" size={15} color="#fff" /> Hecho hoy</> : 'Marcar como hecho'}
                </button>
              ) : (
                <>
                  <div className="stepper" style={{ marginBottom: 12 }}>
                    <button className="step-btn" onClick={() => setVal(h.id, Math.max(0, h.hoy - h.paso))}><Icon name="minus" size={15} /></button>
                    <div className="progress" style={{ flex: 1 }}><i style={{ width: pct + '%', background: ok ? tone(h.color) : `color-mix(in srgb, ${tone(h.color)} 60%, var(--surface-3))` }} /></div>
                    <button className="step-btn" onClick={() => setVal(h.id, h.hoy + h.paso)}><Icon name="plus" size={15} /></button>
                  </div>
                  <div className="habit-obj" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{h.mejor_mas ? 'Progreso' : 'Consumido'}</span>
                    <span style={{ color: ok ? tone(h.color) : 'var(--muted)', fontWeight: 700 }}>{Math.round(pct)}%</span>
                  </div>
                </>
              )}
            </div>
          )
        })}
        {items.length === 0 && <div className="empty">Sin hábitos activos. Agrégalos en Ajustes.</div>}
      </div>

      <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="row"><Icon name="fire" size={16} color="var(--accent-2)" /><strong style={{ fontSize: 14 }}>Actividad de autocuidado</strong><span className="muted" style={{ fontSize: 12 }}>· lo que no sueles trackear</span></div>
          <button className="btn subtle" onClick={addAuto}><Icon name="plus" size={14} /> Añadir</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {auto.length === 0 && <div className="empty">Sin actividades de autocuidado aún.</div>}
          {auto.map((a) => (
            <div key={a.id} className="row" style={{ gap: 12, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <Check on={a.done} onClick={() => toggleAuto(a.id)} size={20} />
              <input className="inp" style={{ background: 'transparent', textDecoration: a.done ? 'line-through' : 'none', color: a.done ? 'var(--muted)' : 'var(--text)' }} placeholder="¿Qué hiciste por ti?"
                value={a.texto} onChange={(e) => updAuto(a.id, e.target.value)} onBlur={(e) => guardarAuto(a.id, e.target.value)} />
              <button className="icon-btn" style={{ width: 30, height: 30, border: 'none', background: 'transparent' }} onClick={() => delAuto(a.id)}><Icon name="trash" size={15} /></button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
