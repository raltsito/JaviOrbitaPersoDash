import { useState } from 'react'
import { auth } from '../api.js'
import logo from '../assets/logo.png'

/* Pantalla de acceso: login y registro con la estética del prototipo. */
export default function AuthScreen({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      const user =
        modo === 'login'
          ? await auth.login(email, password)
          : await auth.registro(nombre, email, password)
      onLogin(user)
    } catch (err) {
      const d = err.data
      setError(
        d?.detail ||
          d?.email?.[0] ||
          d?.password?.[0] ||
          d?.nombre?.[0] ||
          'No se pudo completar la operación.',
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <img src={logo} alt="Órbita" width="56" />
          <div className="eyebrow" style={{ marginTop: 8 }}>Órbita</div>
          <h1 style={{ fontSize: 22, margin: '6px 0 2px' }}>
            {modo === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </h1>
          <div className="muted" style={{ fontSize: 13 }}>Tu dashboard personal</div>
        </div>

        <div className="seg" style={{ width: '100%', marginBottom: 18 }}>
          <button className={modo === 'login' ? 'on' : ''} style={{ flex: 1 }} onClick={() => { setModo('login'); setError(null) }}>
            Iniciar sesión
          </button>
          <button className={modo === 'registro' ? 'on' : ''} style={{ flex: 1 }} onClick={() => { setModo('registro'); setError(null) }}>
            Registrarme
          </button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {modo === 'registro' && (
            <input className="inp" placeholder="Tu nombre" value={nombre} required maxLength={80}
              onChange={(e) => setNombre(e.target.value)} />
          )}
          <input className="inp" type="email" placeholder="Email" value={email} required autoComplete="email"
            onChange={(e) => setEmail(e.target.value)} />
          <input className="inp" type="password" placeholder="Contraseña" value={password} required
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            onChange={(e) => setPassword(e.target.value)} />

          {error && (
            <div style={{ color: 'var(--red)', fontSize: 13, fontWeight: 600 }}>{error}</div>
          )}

          <button className="btn" type="submit" disabled={cargando} style={{ justifyContent: 'center', marginTop: 4 }}>
            {cargando ? 'Un momento…' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
