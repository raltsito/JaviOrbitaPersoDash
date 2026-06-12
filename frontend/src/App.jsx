import { useEffect, useState } from 'react'
import { auth } from './api.js'
import AuthScreen from './auth/AuthScreen.jsx'
import logo from './assets/logo.png'

/* Shell provisional (Sprint 1): guard de sesión + saludo con el nombre
   del perfil. El shell real con sidebar llega en el Sprint 3. */
function App() {
  const [user, setUser] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    auth
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCargando(false))
  }, [])

  // aplica el tema guardado en el perfil
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', user?.perfil?.tema || 'claro')
  }, [user])

  if (cargando) {
    return <div className="empty" style={{ paddingTop: 120 }}>Cargando…</div>
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />
  }

  const hora = new Date().getHours()
  const saludo = hora < 6 ? 'Aún despierto' : hora < 13 ? 'Buenos días' : hora < 20 ? 'Buenas tardes' : 'Buenas noches'

  const salir = async () => {
    await auth.logout()
    setUser(null)
  }

  return (
    <div className="content" style={{ paddingTop: 60 }}>
      <div className="card" style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
        <img src={logo} alt="Órbita" width="64" style={{ marginBottom: 12 }} />
        <div className="eyebrow">Órbita</div>
        <h1 style={{ fontSize: 24, margin: '8px 0' }}>
          {saludo}, {user.perfil?.nombre}
        </h1>
        <p className="muted" style={{ fontSize: 13.5, marginBottom: 18 }}>
          Sesión iniciada como {user.email}. El dashboard completo llega en el Sprint 3.
        </p>
        <button className="btn subtle" onClick={salir}>Cerrar sesión</button>
      </div>
    </div>
  )
}

export default App
