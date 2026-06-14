import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import ErrorMsg from '../components/ErrorMsg.jsx'
import Icon from '../components/Icon.jsx'
import { Ring } from '../components/charts.jsx'
import { useApp } from '../context/AppContext.jsx'
import { resumen } from '../api.js'
import { fechaLarga, hoy, MESES } from '../lib/dates.js'
import AgendaDia from './hoy/AgendaDia.jsx'
import AgendaSemana from './hoy/AgendaSemana.jsx'
import AgendaMes from './hoy/AgendaMes.jsx'
import AgendaAno from './hoy/AgendaAno.jsx'
import HabitTracker from './hoy/HabitTracker.jsx'
import ObjetivosTrack from './hoy/ObjetivosTrack.jsx'
import Accesos from './hoy/Accesos.jsx'
import Frase from './hoy/Frase.jsx'

const VISTAS = [{ k: 'dia', l: 'Día' }, { k: 'semana', l: 'Semana' }, { k: 'mes', l: 'Mes' }, { k: 'año', l: 'Año' }]

export default function VistaHoy() {
  const { perfil, refreshRacha } = useApp()
  const [vista, setVista] = useState(perfil.vista_agenda || 'dia')
  const [fechaSel, setFechaSel] = useState(hoy())
  const [res, setRes] = useState(null)
  const [error, setError] = useState(false)

  const cargarResumen = () => {
    resumen.hoy().then((r) => { setError(false); setRes(r) }).catch(() => setError(true))
  }

  const refrescarResumen = () => {
    cargarResumen()
    refreshRacha()
  }

  useEffect(() => { cargarResumen() }, [])

  const pct = res?.actividades.pct ?? 0
  const hechas = res?.actividades.hechas ?? 0
  const total = res?.actividades.total ?? 0
  const racha = res?.racha ?? 0
  const habVerde = res?.habitos.en_verde ?? 0
  const habTotal = res?.habitos.total ?? 0

  const tituloAgenda = vista === 'dia' ? fechaLarga(fechaSel)
    : vista === 'semana' ? 'esta semana'
    : vista === 'mes' ? MESES[fechaSel.getMonth()]
    : fechaSel.getFullYear()

  const seleccionarDia = (d) => { setFechaSel(d); setVista('dia') }

  return (
    <div className="view grid" style={{ gap: 'var(--gap)' }}>
      {/* resumen */}
      {error ? (
        <Card><ErrorMsg onRetry={cargarResumen} /></Card>
      ) : (
        <div className="grid resumen-grid" style={{ gridTemplateColumns: '1.4fr 1fr 1fr', gap: 'var(--gap)' }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Ring value={pct} size={88} color="violet" sub="del día" />
            <div>
              <div className="eyebrow">Progreso de hoy</div>
              <h2 style={{ fontSize: 19, margin: '6px 0 4px' }}>{hechas} de {total} actividades</h2>
              <div className="muted" style={{ fontSize: 13 }}>{pct >= 100 ? '¡Día completado!' : pct >= 60 ? 'Buen ritmo, sigue así.' : 'Aún queda jornada por delante.'}</div>
            </div>
          </Card>
          <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="kpi"><span className="n" style={{ color: 'var(--accent-2)' }}>{racha}</span><span className="l">Días de racha</span></div>
          </Card>
          <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="kpi"><span className="n" style={{ color: 'var(--green)' }}>{habVerde}/{habTotal}</span><span className="l">Hábitos en verde hoy</span></div>
          </Card>
        </div>
      )}

      {/* Agenda */}
      <Card>
        <div className="card-h" style={{ flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 16 }}>Actividades · {tituloAgenda}</h2>
          <div className="spacer" style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="seg">{VISTAS.map((v) => <button key={v.k} className={vista === v.k ? 'on' : ''} onClick={() => setVista(v.k)}>{v.l}</button>)}</div>
            {vista === 'dia' && <button className="icon-btn" title="Imprimir agenda" onClick={() => window.print()}><Icon name="print" size={18} /></button>}
          </div>
        </div>
        {vista === 'dia' && <AgendaDia fecha={fechaSel} onChange={refrescarResumen} />}
        {vista === 'semana' && <AgendaSemana onSelectDay={seleccionarDia} />}
        {vista === 'mes' && <AgendaMes fechaSeleccionada={fechaSel} onSelectDay={seleccionarDia} />}
        {vista === 'año' && <AgendaAno />}
      </Card>

      {/* Objetivos + accesos */}
      <div className="grid obj-accesos-grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: 'var(--gap)', alignItems: 'start' }}>
        <ObjetivosTrack />
        <Accesos />
      </div>

      {/* Habit tracker */}
      <HabitTracker onChange={refrescarResumen} />

      {/* Frase */}
      <Frase />
    </div>
  )
}
