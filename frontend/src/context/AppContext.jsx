import { createContext, useContext } from 'react'

export const AppContext = createContext(null)

/** Acceso al estado global de la app: usuario, perfil, racha y navegación. */
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <Shell>')
  return ctx
}
