// Color token -> variable CSS del tema activo.
const TONE = {
  violet: 'var(--accent)',
  amber: 'var(--accent-2)',
  green: 'var(--green)',
  blue: 'var(--blue)',
  mint: 'var(--mint)',
  red: 'var(--red)',
}

export function tone(k) {
  return TONE[k] || k || 'var(--accent)'
}
