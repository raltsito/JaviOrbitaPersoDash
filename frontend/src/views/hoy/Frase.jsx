import { useEffect, useState } from 'react'
import Card from '../../components/Card.jsx'
import ErrorMsg from '../../components/ErrorMsg.jsx'
import { frase as fraseApi } from '../../api.js'
import { MESES, hoy } from '../../lib/dates.js'

export default function Frase() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(false)

  const cargar = () => {
    fraseApi.get().then((d) => { setError(false); setDatos(d) }).catch(() => setError(true))
  }

  useEffect(cargar, [])

  if (error) return <Card className="frase"><ErrorMsg onRetry={cargar} msg="No se pudo cargar la frase del mes." /></Card>
  if (!datos) return null

  return (
    <Card className="frase">
      <div className="eyebrow" style={{ marginBottom: 14 }}>Frase del mes · {MESES[hoy().getMonth()]}</div>
      <div className="q">"{datos.texto}"</div>
      {datos.autor && <div className="a">— {datos.autor}</div>}
    </Card>
  )
}
