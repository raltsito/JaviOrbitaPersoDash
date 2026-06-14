/* Cliente de la API de Órbita.
   Sesión con cookies de Django + CSRF: antes del primer POST se pide
   /api/auth/csrf/ para recibir la cookie csrftoken, y cada petición
   de escritura la reenvía en el header X-CSRFToken. */

function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : null
}

async function ensureCsrf() {
  if (!getCookie('csrftoken')) await fetch('/api/auth/csrf/')
  return getCookie('csrftoken')
}

export class ApiError extends Error {
  constructor(status, data) {
    super(data?.detail || `Error ${status}`)
    this.status = status
    this.data = data
  }
}

async function request(method, url, body) {
  const opts = { method, headers: {} }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  if (method !== 'GET') opts.headers['X-CSRFToken'] = await ensureCsrf()

  const res = await fetch(url, opts)
  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  patch: (url, body) => request('PATCH', url, body),
  delete: (url) => request('DELETE', url),
}

export const auth = {
  me: () => api.get('/api/auth/me/'),
  login: (email, password) => api.post('/api/auth/login/', { email, password }),
  registro: (nombre, email, password) => api.post('/api/auth/registro/', { nombre, email, password }),
  logout: () => api.post('/api/auth/logout/'),
}

/* ---- helpers de recursos del dominio (/api/) ---- */

function qs(params) {
  if (!params) return ''
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, v)
  })
  const s = usp.toString()
  return s ? `?${s}` : ''
}

function crud(base) {
  return {
    list: (params) => api.get(base + qs(params)),
    create: (data) => api.post(base, data),
    update: (id, data) => api.patch(`${base}${id}/`, data),
    remove: (id) => api.delete(`${base}${id}/`),
  }
}

export const actividades = crud('/api/actividades/')
export const bloques = crud('/api/bloques/')
export const autocuidado = crud('/api/autocuidado/')
export const habitos = crud('/api/habitos/')
export const objetivos = crud('/api/objetivos/')
export const conexiones = crud('/api/conexiones/')
export const accesos = crud('/api/accesos/')

export const registros = {
  list: (params) => api.get('/api/registros/' + qs(params)),
  // POST hace upsert en el backend sobre (habito, fecha)
  upsert: (data) => api.post('/api/registros/', data),
}

export const perfil = {
  get: () => api.get('/api/perfil/'),
  update: (data) => api.patch('/api/perfil/', data),
}

export const frase = {
  get: () => api.get('/api/frase/'),
  update: (data) => api.patch('/api/frase/', data),
}

export const resumen = {
  hoy: () => api.get('/api/resumen/hoy/'),
}

export const analisis = {
  get: () => api.get('/api/analisis/'),
}

export const restablecer = {
  run: () => api.post('/api/restablecer/'),
}
