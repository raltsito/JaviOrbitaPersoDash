import { tone } from '../lib/tone.js'

/* Barras verticales */
export function BarChart({ data, labels, height = 150, color = 'violet', target, max }) {
  const mx = max || Math.max(...data, target || 0) * 1.15 || 1
  const c = tone(color)
  return (
    <div>
      <svg width="100%" height={height} viewBox={`0 0 ${data.length * 44} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        {target != null && (
          <line x1="0" x2={data.length * 44} y1={height - (target / mx) * (height - 26)} y2={height - (target / mx) * (height - 26)}
            stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />
        )}
        {data.map((v, i) => {
          const h = Math.max((v / mx) * (height - 26), 3)
          const x = i * 44 + 8
          return (
            <g key={i}>
              <rect x={x} y={height - h - 18} width="28" height={h} rx="6" fill={c} opacity={0.25 + 0.6 * (v / mx)} />
              <text x={x + 14} y={height - 4} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="var(--font-body)">{labels[i]}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* Línea suave con área */
export function LineChart({ data, labels, height = 160, color = 'violet' }) {
  const w = 520, pad = 8
  const mx = Math.max(...data) * 1.12 || 1, mn = Math.min(...data, 0)
  const c = tone(color)
  const X = (i) => pad + (i * (w - pad * 2)) / (data.length - 1)
  const Y = (v) => height - 22 - ((v - mn) / (mx - mn || 1)) * (height - 36)
  const pts = data.map((v, i) => [X(i), Y(v)])
  const path = pts.map((pt, i) => (i === 0 ? `M${pt[0]},${pt[1]}` : `L${pt[0]},${pt[1]}`)).join(' ')
  const area = `${path} L${X(data.length - 1)},${height - 22} L${X(0)},${height - 22} Z`
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={'ln' + color} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.28" /><stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#ln${color})`} />
      <path d={path} fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((pt, i) => <circle key={i} cx={pt[0]} cy={pt[1]} r="3" fill="var(--surface)" stroke={c} strokeWidth="2" />)}
      {labels.map((l, i) => <text key={i} x={X(i)} y={height - 4} textAnchor="middle" fontSize="10.5" fill="var(--muted)" fontFamily="var(--font-body)">{l}</text>)}
    </svg>
  )
}

/* Anillo de progreso */
export function Ring({ value, size = 96, stroke = 9, color = 'violet', label, sub }) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r
  const c = tone(color)
  const off = C * (1 - Math.min(value, 100) / 100)
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.26, lineHeight: 1 }}>{label != null ? label : Math.round(value) + '%'}</div>
          {sub && <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  )
}

/* Mini barras (sparkline-ish) */
export function MiniBars({ data, color = 'violet', target, mejorMas = true, height = 36 }) {
  const mx = Math.max(...data, target || 0) || 1
  const c = tone(color)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height }}>
      {data.map((v, i) => {
        const ok = mejorMas ? v >= target : v <= target
        return <div key={i} title={String(v)} style={{ flex: 1, height: `${Math.max((v / mx) * 100, 8)}%`, background: ok ? c : 'var(--surface-3)', borderRadius: 4, transition: 'height .4s' }} />
      })}
    </div>
  )
}
