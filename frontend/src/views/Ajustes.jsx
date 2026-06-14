import { useEffect, useState } from 'react'
import Card from '../components/Card.jsx'
import ErrorMsg from '../components/ErrorMsg.jsx'
import Icon from '../components/Icon.jsx'
import { tone } from '../lib/tone.js'
import { CATEGORIAS } from '../lib/categorias.js'
import { useApp } from '../context/AppContext.jsx'
import { frase as fraseApi, habitos, objetivos, restablecer } from '../api.js'

const ACENTOS = ['#7c5cfc', '#7c4fc4', '#2a6fdb', '#1f8a5b', '#e0578a']
const DENSIDADES = [{ k: 'compact', l: 'Compacta' }, { k: 'regular', l: 'Regular' }, { k: 'comfy', l: 'Cómoda' }]
const PERIODOS_OBJ = ['diario', 'semanal', 'mes', 'año']
const HAB_COLORES = [
  { k: 'violet', l: 'Violeta' },
  { k: 'amber', l: 'Ámbar' },
  { k: 'green', l: 'Verde' },
  { k: 'blue', l: 'Azul' },
  { k: 'mint', l: 'Menta' },
  { k: 'red', l: 'Rojo' },
]
const HAB_ICONOS = [
  { k: 'spark', l: 'Destello' },
  { k: 'drop', l: 'Gota' },
  { k: 'stretch', l: 'Estiramiento' },
  { k: 'smoke', l: 'Humo' },
  { k: 'run', l: 'Correr' },
  { k: 'lotus', l: 'Mindfulness' },
  { k: 'apple', l: 'Manzana' },
  { k: 'fire', l: 'Fuego' },
  { k: 'habitos', l: 'Hábito' },
]
const HABITO_NUEVO = { nombre: 'Nuevo hábito', tipo: 'cantidad', unidad: '', objetivo: 1, paso: 1, mejor_mas: true, color: 'violet', icono: 'spark' }

export default function VistaAjustes() {
  const { perfil, updatePerfil, theme, setTheme } = useApp()
  const [objs, setObjs] = useState(null)
  const [habs, setHabs] = useState(null)
  const [fraseData, setFraseData] = useState(null)
  const [restableciendo, setRestableciendo] = useState(false)
  const [msgDatos, setMsgDatos] = useState('')
  const [errObjs, setErrObjs] = useState(false)
  const [errHabs, setErrHabs] = useState(false)
  const [errFrase, setErrFrase] = useState(false)

  const cargarObjs = () => {
    objetivos.list().then((data) => { setErrObjs(false); setObjs(data) }).catch(() => setErrObjs(true))
  }
  const cargarHabs = () => {
    habitos.list().then((hs) => { setErrHabs(false); setHabs(hs.map((h) => ({ ...h, objetivo: parseFloat(h.objetivo), paso: parseFloat(h.paso) }))) }).catch(() => setErrHabs(true))
  }
  const cargarFrase = () => {
    fraseApi.get().then((data) => { setErrFrase(false); setFraseData(data) }).catch(() => setErrFrase(true))
  }

  useEffect(() => {
    cargarObjs()
    cargarHabs()
    cargarFrase()
  }, [])

  const updObj = (id, field, val) => {
    setObjs((s) => s.map((o) => (o.id === id ? { ...o, [field]: val } : o)))
    objetivos.update(id, { [field]: val })
  }
  const delObj = (id) => {
    setObjs((s) => s.filter((o) => o.id !== id))
    objetivos.remove(id)
  }
  const addObj = () => objetivos.create({ titulo: 'Nuevo objetivo', periodo: 'diario', categoria: 'mente', progreso: 0 }).then((o) => setObjs((s) => [...s, o]))

  const updHabObjetivo = (h, dir) => {
    const objetivo = Math.max(h.paso, +(h.objetivo + dir * h.paso).toFixed(2))
    setHabs((s) => s.map((x) => (x.id === h.id ? { ...x, objetivo } : x)))
    habitos.update(h.id, { objetivo })
  }

  const updHabLocal = (id, field, val) => setHabs((s) => s.map((x) => (x.id === id ? { ...x, [field]: val } : x)))
  const guardarHab = (id, field, val) => {
    setHabs((s) => s.map((x) => (x.id === id ? { ...x, [field]: val } : x)))
    habitos.update(id, { [field]: val }).catch(() => {})
  }
  const toggleActivoHab = (h) => {
    const activo = !h.activo
    setHabs((s) => s.map((x) => (x.id === h.id ? { ...x, activo } : x)))
    habitos.update(h.id, { activo })
  }
  const addHab = () => habitos.create(HABITO_NUEVO)
    .then((h) => setHabs((s) => [...s, { ...h, objetivo: parseFloat(h.objetivo), paso: parseFloat(h.paso) }]))

  const updFrase = (field, val) => setFraseData((f) => ({ ...f, [field]: val }))
  const guardarFrase = (field, val) => fraseApi.update({ [field]: val }).catch(() => {})

  const handleRestablecer = () => {
    if (!window.confirm('¿Borrar todo tu historial (agenda, registros de hábitos y autocuidado)? Esta acción no se puede deshacer.')) return
    setRestableciendo(true)
    setMsgDatos('')
    restablecer.run()
      .then(() => setMsgDatos('Historial borrado.'))
      .catch(() => setMsgDatos('No se pudo borrar el historial. Intenta de nuevo.'))
      .finally(() => setRestableciendo(false))
  }

  return (
    <div className="view grid" style={{ gap: 'var(--gap)', maxWidth: 820 }}>
      <div>
        <div className="eyebrow">Ajustes</div>
        <h1 style={{ fontSize: 24, marginTop: 4 }}>Personaliza tu Órbita</h1>
        <div className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Pequeños cambios sin afectar tus registros.</div>
      </div>

      {/* Apariencia */}
      <Card title="Apariencia" icon="ajustes" iconColor="violet">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div><strong style={{ fontSize: 14 }}>Tema</strong><div className="muted" style={{ fontSize: 12.5 }}>Claro de día, oscuro de noche.</div></div>
          <div className="seg">
            <button className={theme === 'claro' ? 'on' : ''} onClick={() => setTheme('claro')}><Icon name="sun" size={15} /></button>
            <button className={theme === 'oscuro' ? 'on' : ''} onClick={() => setTheme('oscuro')}><Icon name="moon" size={15} /></button>
          </div>
        </div>

        <div className="divider" style={{ margin: '16px 0' }} />

        <div className="row between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div><strong style={{ fontSize: 14 }}>Color de acento</strong><div className="muted" style={{ fontSize: 12.5 }}>El color principal de tu Órbita.</div></div>
          <div className="row" style={{ gap: 10 }}>
            {ACENTOS.map((hex) => (
              <button key={hex} onClick={() => updatePerfil({ acento: hex })} title={hex}
                style={{ width: 28, height: 28, borderRadius: '50%', background: hex, border: 'none', padding: 0, cursor: 'pointer', boxShadow: perfil.acento === hex ? `0 0 0 2px var(--surface), 0 0 0 4px ${hex}` : 'none' }} />
            ))}
          </div>
        </div>

        <div className="divider" style={{ margin: '16px 0' }} />

        <div className="row between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div><strong style={{ fontSize: 14 }}>Densidad</strong><div className="muted" style={{ fontSize: 12.5 }}>Espaciado de tarjetas y texto.</div></div>
          <div className="seg">
            {DENSIDADES.map((d) => <button key={d.k} className={perfil.densidad === d.k ? 'on' : ''} onClick={() => updatePerfil({ densidad: d.k })}>{d.l}</button>)}
          </div>
        </div>

        <div className="divider" style={{ margin: '16px 0' }} />

        <div className="row between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div><strong style={{ fontSize: 14 }}>Tema espacial</strong><div className="muted" style={{ fontSize: 12.5 }}>Órbitas decorativas en el mapa de objetivos.</div></div>
          <div className="seg">
            <button className={!perfil.tema_espacial ? 'on' : ''} onClick={() => updatePerfil({ tema_espacial: false })}>No</button>
            <button className={perfil.tema_espacial ? 'on' : ''} onClick={() => updatePerfil({ tema_espacial: true })}>Sí</button>
          </div>
        </div>
      </Card>

      {/* Objetivos */}
      <Card title="Objetivos a trackear" sub="Edita títulos, área y periodo" icon="objetivos" iconColor="green"
        right={<button className="btn subtle" onClick={addObj}><Icon name="plus" size={14} /> Nuevo</button>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {errObjs && <ErrorMsg onRetry={cargarObjs} />}
          {!objs && !errObjs && <div className="empty">Cargando…</div>}
          {objs && objs.length === 0 && <div className="empty">Sin objetivos. Crea el primero.</div>}
          {objs && objs.map((o) => (
            <div key={o.id} className="objetivo-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 8, alignItems: 'center' }}>
              <input className="inp" value={o.titulo} onChange={(e) => updObj(o.id, 'titulo', e.target.value)} />
              <select className="inp" style={{ width: 120 }} value={o.categoria} onChange={(e) => updObj(o.id, 'categoria', e.target.value)}>
                {Object.entries(CATEGORIAS).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
              <select className="inp" style={{ width: 110 }} value={o.periodo} onChange={(e) => updObj(o.id, 'periodo', e.target.value)}>
                {PERIODOS_OBJ.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <button className="icon-btn" style={{ width: 34, height: 34, border: 'none', background: 'transparent' }} onClick={() => delObj(o.id)}><Icon name="trash" size={15} /></button>
            </div>
          ))}
        </div>
      </Card>

      {/* Hábitos */}
      <Card title="Hábitos a trackear" sub="Edita, crea o desactiva tus hábitos" icon="habitos" iconColor="blue"
        right={<button className="btn subtle" onClick={addHab}><Icon name="plus" size={14} /> Nuevo</button>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {errHabs && <ErrorMsg onRetry={cargarHabs} />}
          {!habs && !errHabs && <div className="empty">Cargando…</div>}
          {habs && habs.length === 0 && <div className="empty">Sin hábitos. Crea el primero.</div>}
          {habs && habs.map((h) => (
            <div key={h.id} style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)', opacity: h.activo ? 1 : 0.55 }}>
              <div className="row between" style={{ flexWrap: 'wrap', gap: 10 }}>
                <div className="row" style={{ gap: 10, flex: '1 1 180px' }}>
                  <span className="habit-ico" style={{ width: 30, height: 30, background: `color-mix(in srgb, ${tone(h.color)} 16%, transparent)`, color: tone(h.color) }}><Icon name={h.icono} size={16} /></span>
                  <input className="inp" style={{ background: 'transparent', fontWeight: 700, padding: '4px 6px', fontFamily: 'var(--font-display)' }}
                    value={h.nombre} onChange={(e) => updHabLocal(h.id, 'nombre', e.target.value)} onBlur={(e) => guardarHab(h.id, 'nombre', e.target.value)} />
                </div>
                <div className="row wrap" style={{ gap: 8 }}>
                  <select className="inp" style={{ width: 100 }} value={h.tipo} onChange={(e) => guardarHab(h.id, 'tipo', e.target.value)}>
                    <option value="cantidad">Cantidad</option>
                    <option value="sino">Sí / No</option>
                  </select>
                  {h.tipo === 'cantidad' && (
                    <input className="inp" style={{ width: 70 }} placeholder="Unidad" value={h.unidad}
                      onChange={(e) => updHabLocal(h.id, 'unidad', e.target.value)} onBlur={(e) => guardarHab(h.id, 'unidad', e.target.value)} />
                  )}
                  <select className="inp" style={{ width: 100 }} value={h.color} onChange={(e) => guardarHab(h.id, 'color', e.target.value)}>
                    {HAB_COLORES.map((c) => <option key={c.k} value={c.k}>{c.l}</option>)}
                  </select>
                  <select className="inp" style={{ width: 130 }} value={h.icono} onChange={(e) => guardarHab(h.id, 'icono', e.target.value)}>
                    {HAB_ICONOS.map((i) => <option key={i.k} value={i.k}>{i.l}</option>)}
                  </select>
                  <button className="btn subtle" onClick={() => toggleActivoHab(h)}>{h.activo ? 'Desactivar' : 'Activar'}</button>
                </div>
              </div>
              {h.tipo === 'cantidad' && (
                <div className="row" style={{ gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
                  <select className="inp" style={{ width: 90 }} value={h.mejor_mas ? '1' : '0'} onChange={(e) => guardarHab(h.id, 'mejor_mas', e.target.value === '1')}>
                    <option value="1">Meta mín.</option>
                    <option value="0">Máx.</option>
                  </select>
                  <button className="step-btn" style={{ width: 30, height: 30 }} onClick={() => updHabObjetivo(h, -1)}><Icon name="minus" size={13} /></button>
                  <strong style={{ fontFamily: 'var(--font-display)', minWidth: 56, textAlign: 'center' }}>{h.objetivo} {h.unidad}</strong>
                  <button className="step-btn" style={{ width: 30, height: 30 }} onClick={() => updHabObjetivo(h, 1)}><Icon name="plus" size={13} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Frase */}
      <Card title="Frase del mes" sub="Se muestra en tu inicio" icon="spark" iconColor="amber">
        {errFrase ? <ErrorMsg onRetry={cargarFrase} /> : !fraseData ? <div className="empty">Cargando…</div> : (
          <>
            <textarea className="inp" rows="2" style={{ marginBottom: 10, fontFamily: 'var(--font-display)', fontSize: 15 }} value={fraseData.texto} onChange={(e) => updFrase('texto', e.target.value)} onBlur={(e) => guardarFrase('texto', e.target.value)} />
            <input className="inp" placeholder="Autor" value={fraseData.autor} onChange={(e) => updFrase('autor', e.target.value)} onBlur={(e) => guardarFrase('autor', e.target.value)} />
          </>
        )}
      </Card>

      {/* Datos */}
      <Card title="Datos" icon="ajustes" iconColor="red">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div><strong style={{ fontSize: 14 }}>Restablecer historial</strong><div className="muted" style={{ fontSize: 12.5 }}>Borra tu agenda, registros de hábitos y autocuidado. No afecta hábitos, objetivos, conexiones ni el resto de tus ajustes.</div></div>
          <button className="btn subtle" style={{ color: 'var(--red)' }} onClick={handleRestablecer} disabled={restableciendo}>
            <Icon name="trash" size={14} /> {restableciendo ? 'Borrando…' : 'Restablecer'}
          </button>
        </div>
        {msgDatos && <div className="muted" style={{ fontSize: 12.5, marginTop: 10 }}>{msgDatos}</div>}
      </Card>
    </div>
  )
}
