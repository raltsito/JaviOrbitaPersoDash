import { useCallback, useEffect, useState } from 'react'
import Icon from './components/Icon.jsx'
import Logo from './components/Logo.jsx'
import { AppContext } from './context/AppContext.jsx'
import { auth, perfil as perfilApi, resumen } from './api.js'
import { fechaLarga, hoy } from './lib/dates.js'

import VistaHoy from './views/Hoy.jsx'
import VistaAnalisis from './views/Analisis.jsx'
import VistaHabitos from './views/Habitos.jsx'
import VistaConexiones from './views/Conexiones.jsx'
import VistaObjetivos from './views/Objetivos.jsx'
import VistaAjustes from './views/Ajustes.jsx'

const NAV = [
  { k: 'hoy', l: 'Hoy', ico: 'hoy' },
  { k: 'analisis', l: 'Análisis', ico: 'analisis' },
  { k: 'habitos', l: 'Hábitos', ico: 'habitos' },
  { k: 'conexiones', l: 'Conexiones', ico: 'conexiones' },
  { k: 'objetivos', l: 'Objetivos', ico: 'objetivos' },
  { k: 'ajustes', l: 'Ajustes', ico: 'ajustes' },
]

const TITULOS = {
  analisis: { t: 'Análisis', s: 'Tu progreso, visto de cerca' },
  habitos: { t: 'Hábitos', s: 'Constancia diaria' },
  conexiones: { t: 'Conexiones', s: 'Las personas que importan' },
  objetivos: { t: 'Objetivos', s: 'Hacia dónde apuntas' },
  ajustes: { t: 'Ajustes', s: 'Tu Órbita, a tu manera' },
}

const DENSITY = {
  compact: { '--fs-base': '14px', '--gap': '16px', '--card-pad': '16px' },
  regular: { '--fs-base': '15px', '--gap': '22px', '--card-pad': '22px' },
  comfy: { '--fs-base': '16.5px', '--gap': '28px', '--card-pad': '26px' },
}

const VIEWS = {
  hoy: VistaHoy,
  analisis: VistaAnalisis,
  habitos: VistaHabitos,
  conexiones: VistaConexiones,
  objetivos: VistaObjetivos,
  ajustes: VistaAjustes,
}

export default function Shell({ user, onLogout }) {
  const [route, setRoute] = useState('hoy')
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('orbita_collapsed') === '1')
  const [perfil, setPerfil] = useState(user.perfil)
  const [racha, setRacha] = useState(0)

  useEffect(() => {
    localStorage.setItem('orbita_collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  // tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', perfil.tema || 'claro')
  }, [perfil.tema])

  // acento / densidad / tema espacial -> variables CSS y body
  useEffect(() => {
    const r = document.documentElement
    if (perfil.acento) {
      r.style.setProperty('--accent', perfil.acento)
      r.style.setProperty('--accent-press', perfil.acento)
    }
    const d = DENSITY[perfil.densidad] || DENSITY.regular
    Object.entries(d).forEach(([k, v]) => r.style.setProperty(k, v))
    document.body.classList.toggle('space', !!perfil.tema_espacial)
  }, [perfil.acento, perfil.densidad, perfil.tema_espacial])

  const refreshRacha = useCallback(() => {
    resumen.hoy().then((r) => setRacha(r.racha)).catch(() => {})
  }, [])
  useEffect(() => { refreshRacha() }, [refreshRacha])

  const updatePerfil = useCallback((patch) => {
    setPerfil((p) => ({ ...p, ...patch }))
    perfilApi.update(patch).catch(() => {})
  }, [])

  const navigate = useCallback((k) => {
    setRoute(k)
    setMenuOpen(false)
    window.scrollTo({ top: 0 })
  }, [])
  useEffect(() => { window.__nav = navigate }, [navigate])

  const toggleSidebar = () => {
    if (window.matchMedia('(max-width: 880px)').matches) setMenuOpen((v) => !v)
    else setCollapsed((v) => !v)
  }

  const theme = perfil.tema || 'claro'
  const setTheme = (v) => updatePerfil({ tema: v })

  const d = hoy()
  const hora = d.getHours()
  const nombre = perfil.nombre || ''
  const saludo = hora < 6 ? `Aún despierto, ${nombre}` : hora < 13 ? `Buenos días, ${nombre}` : hora < 20 ? `Buenas tardes, ${nombre}` : `Buenas noches, ${nombre}`

  const View = VIEWS[route]
  const ti = TITULOS[route]
  const titulo = route === 'hoy' ? saludo : ti.t
  const sub = route === 'hoy' ? fechaLarga(d) : ti.s

  const cerrarSesion = async () => {
    await auth.logout()
    onLogout()
  }

  const ctx = { user, perfil, updatePerfil, racha, refreshRacha, navigate, theme, setTheme }

  return (
    <AppContext.Provider value={ctx}>
      <div className={'app' + (collapsed ? ' collapsed' : '')}>
        {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}
        <aside className={'sidebar' + (menuOpen ? ' open' : '')}>
          <div className="brand">
            <Logo size={38} />
            <div>
              <div className="brand-name">Órbita</div>
              <div className="brand-sub">Dashboard personal</div>
            </div>
            <button className="collapse-btn" onClick={() => setCollapsed((v) => !v)} title={collapsed ? 'Expandir' : 'Colapsar'}>
              <Icon name="chevron" size={16} />
            </button>
          </div>

          <div className="nav-label">Tablero</div>
          {NAV.slice(0, 1).map((n) => <NavItem key={n.k} n={n} active={route === n.k} onClick={() => navigate(n.k)} />)}

          <div className="nav-label">Paneles</div>
          {NAV.slice(1, 5).map((n) => <NavItem key={n.k} n={n} active={route === n.k} onClick={() => navigate(n.k)} />)}

          <div className="nav-label">Sistema</div>
          {NAV.slice(5).map((n) => <NavItem key={n.k} n={n} active={route === n.k} onClick={() => navigate(n.k)} />)}

          <div className="sidebar-foot">
            <div className="streak">
              <Icon name="fire" size={26} color="var(--accent-2)" />
              <div><div className="streak-n">{racha}</div><div className="streak-l">días de racha</div></div>
            </div>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <button className="icon-btn menu-btn" onClick={toggleSidebar}><Icon name="menu" size={20} /></button>
            <div>
              <h1>{titulo}</h1>
              <div className="sub">{sub}</div>
            </div>
            <div className="topbar-actions">
              <button className="icon-btn" title={theme === 'claro' ? 'Modo oscuro' : 'Modo claro'} onClick={() => setTheme(theme === 'claro' ? 'oscuro' : 'claro')}>
                <Icon name={theme === 'claro' ? 'moon' : 'sun'} size={19} />
              </button>
              <button className="icon-btn" title="Cerrar sesión" onClick={cerrarSesion}>
                <Icon name="logout" size={19} />
              </button>
            </div>
          </header>
          <main className="content">
            <View />
          </main>
        </div>
      </div>
    </AppContext.Provider>
  )
}

function NavItem({ n, active, onClick }) {
  return (
    <button className={'nav-item' + (active ? ' active' : '')} onClick={onClick} title={n.l}>
      <Icon name={n.ico} size={19} /> <span className="nav-text">{n.l}</span>
    </button>
  )
}
