export default function ErrorMsg({ onRetry, msg = 'No se pudo cargar la información. Revisa tu conexión.' }) {
  return (
    <div className="empty error">
      <div>{msg}</div>
      {onRetry && <button className="btn subtle" onClick={onRetry} style={{ marginTop: 12 }}>Reintentar</button>}
    </div>
  )
}
