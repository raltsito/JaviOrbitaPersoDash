import { useEffect, useState } from 'react'
import { auth } from './api.js'
import AuthScreen from './auth/AuthScreen.jsx'
import Shell from './Shell.jsx'

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

  if (cargando) {
    return <div className="empty" style={{ paddingTop: 120 }}>Cargando…</div>
  }

  if (!user) {
    return <AuthScreen onLogin={setUser} />
  }

  return <Shell user={user} onLogout={() => setUser(null)} />
}

export default App
