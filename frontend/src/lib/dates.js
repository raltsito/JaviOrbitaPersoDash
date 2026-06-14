export const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
export const DIAS_LARGO = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export function hoy() {
  return new Date()
}

export function fechaLarga(d) {
  return `${DIAS_LARGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`
}

/** Fecha local en formato YYYY-MM-DD (evita el corrimiento de toISOString con UTC). */
export function isoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseIsoDate(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

/** Lunes de la semana que contiene la fecha dada. */
export function inicioSemana(d) {
  return addDays(d, -((d.getDay() + 6) % 7))
}

/** Etiqueta corta (Lun..Dom) del día de la semana de una fecha. */
export function diaCorto(d) {
  return DIAS[(d.getDay() + 6) % 7]
}
