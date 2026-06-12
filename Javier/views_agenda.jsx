/* ====================================================================
   views_agenda.jsx — Vista "Hoy": agenda editable, accesos rápidos,
   objetivos, habit tracker, autocuidado, frase del mes.
   ==================================================================== */

/* ---- Accesos rápidos (launchers externos) ---- */
const LAUNCHERS = [
  { name: "Claude", icon: "ai", color: "#7c5cfc", url: "https://claude.ai" },
  { name: "ChatGPT", icon: "spark", color: "#10a37f", url: "https://chatgpt.com" },
  { name: "Música", icon: "music", color: "#1db954", url: "https://open.spotify.com" },
  { name: "YouTube", icon: "play", color: "#ff3b30", url: "https://youtube.com" },
  { name: "Canva", icon: "design", color: "#60a5fa", url: "https://canva.com" },
];

function Accesos() {
  return (
    <Card title="Accesos rápidos" sub="Tus herramientas, a un clic" icon="spark" iconColor="violet">
      <div className="launchers">
        {LAUNCHERS.map((l) => (
          <a key={l.name} className="launcher" href={l.url} target="_blank" rel="noreferrer">
            <span className="lch-ico" style={{ background: `color-mix(in srgb, ${l.color} 16%, transparent)`, color: l.color }}>
              <Icon name={l.icon} size={24} />
            </span>
            <span>{l.name}</span>
          </a>
        ))}
      </div>
    </Card>
  );
}

/* ---- Toast ---- */
function useToast() {
  const [msg, setMsg] = useState(null);
  const show = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2400); };
  const node = msg ? (
    <div style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 90,
      background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", color: "var(--text)",
      padding: "12px 18px", borderRadius: 12, fontSize: 13.5, fontWeight: 600, display: "flex", gap: 8, alignItems: "center" }}>
      <Icon name="check" size={16} color="var(--green)" /> {msg}
    </div>
  ) : null;
  return [node, show];
}

/* ---- Agenda diaria editable ---- */
function AgendaDia({ state, setState, show }) {
  const upd = (id, field, val) => setState((s) => ({ ...s, agenda: s.agenda.map((r) => r.id === id ? { ...r, [field]: val } : r) }));
  const toggle = (id) => setState((s) => ({ ...s, agenda: s.agenda.map((r) => r.id === id ? { ...r, done: !r.done } : r) }));
  const del = (id) => setState((s) => ({ ...s, agenda: s.agenda.filter((r) => r.id !== id) }));
  const add = () => setState((s) => ({ ...s, agenda: [...s.agenda, { id: "a" + Date.now(), hora: "12:00", actividad: "Nueva actividad", done: false, notas: "" }] }));

  return (
    <table className="agenda">
      <thead><tr>
        <th style={{ width: 70 }}>Hora</th><th>Actividad</th>
        <th style={{ width: 44, textAlign: "center" }}>✓</th><th style={{ width: "34%" }}>Notas</th><th style={{ width: 34 }}></th>
      </tr></thead>
      <tbody>
        {state.agenda.map((r) => (
          <tr key={r.id} className={r.done ? "done" : ""}>
            <td><input className="inp" style={{ background: "transparent", padding: "4px 6px", fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--accent)", width: 62 }} value={r.hora} onChange={(e) => upd(r.id, "hora", e.target.value)} /></td>
            <td><input className="inp actv" style={{ background: "transparent", padding: "4px 6px", fontWeight: 600 }} value={r.actividad} onChange={(e) => upd(r.id, "actividad", e.target.value)} /></td>
            <td style={{ textAlign: "center" }}><div style={{ display: "inline-block" }}><Check on={r.done} onClick={() => toggle(r.id)} size={22} /></div></td>
            <td><input className="inp" style={{ background: "transparent", padding: "4px 6px", color: "var(--muted)" }} placeholder="Añade una nota…" value={r.notas} onChange={(e) => upd(r.id, "notas", e.target.value)} /></td>
            <td><button className="icon-btn" style={{ width: 30, height: 30, border: "none", background: "transparent" }} onClick={() => del(r.id)} title="Eliminar"><Icon name="trash" size={15} /></button></td>
          </tr>
        ))}
      </tbody>
      <tfoot><tr><td colSpan="5" style={{ paddingTop: 14 }}>
        <button className="btn subtle" onClick={add}><Icon name="plus" size={15} /> Añadir actividad</button>
      </td></tr></tfoot>
    </table>
  );
}

/* ---- Agenda semanal (board) ---- */
function AgendaSemana({ state }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 10 }}>
      {state.semana.map((d, i) => {
        const esHoy = i === ((ORB.hoy().getDay() + 6) % 7);
        return (
          <div key={d.dia} style={{ border: "1px solid " + (esHoy ? "var(--accent)" : "var(--border)"), borderRadius: 12, padding: 12, background: esHoy ? "var(--accent-tint)" : "var(--surface-2)", minHeight: 150 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 10, color: esHoy ? "var(--accent)" : "var(--text)" }}>{d.dia}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {d.bloques.map((b, j) => <div key={j} style={{ fontSize: 11.5, padding: "6px 8px", borderRadius: 7, background: "var(--surface)", border: "1px solid var(--border)", lineHeight: 1.3 }}>{b}</div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---- Agenda mes (calendario) ---- */
function AgendaMes() {
  const d = ORB.hoy(), y = d.getFullYear(), m = d.getMonth();
  const first = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells = []; for (let i = 0; i < first; i++) cells.push(null);
  for (let i = 1; i <= days; i++) cells.push(i);
  const busy = { 3: 2, 5: 1, 8: 3, 12: 2, 15: 1, 18: 4, 21: 2, 24: 3, 27: 1 };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6 }}>
        {ORB.DIAS.map((x) => <div key={x} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "var(--muted)" }}>{x}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
        {cells.map((c, i) => (
          <div key={i} style={{ aspectRatio: "1.1", borderRadius: 9, border: "1px solid " + (c === d.getDate() ? "var(--accent)" : "var(--border)"), background: c === d.getDate() ? "var(--accent-tint)" : c ? "var(--surface-2)" : "transparent", padding: 7, display: c ? "flex" : "none", flexDirection: "column" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: c === d.getDate() ? "var(--accent)" : "var(--text)" }}>{c}</span>
            {busy[c] && <div style={{ marginTop: "auto", display: "flex", gap: 2 }}>{Array.from({ length: busy[c] }).map((_, k) => <span key={k} style={{ width: 5, height: 5, borderRadius: 9, background: "var(--accent)" }} />)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Agenda año ---- */
function AgendaAno() {
  const cur = ORB.hoy().getMonth();
  const vals = ORB.series.actividadesPorMes;
  const mx = Math.max(...vals);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
      {ORB.MESES.map((mes, i) => (
        <div key={mes} style={{ border: "1px solid " + (i === cur ? "var(--accent)" : "var(--border)"), borderRadius: 11, padding: 12, background: i === cur ? "var(--accent-tint)" : "var(--surface-2)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "capitalize", marginBottom: 8, color: i === cur ? "var(--accent)" : "var(--text)" }}>{mes.slice(0, 3)}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>{i <= cur ? vals[i] : "—"}</div>
          <div style={{ height: 5, borderRadius: 9, background: "var(--surface-3)", marginTop: 8, overflow: "hidden" }}><i style={{ display: "block", height: "100%", width: `${i <= cur ? (vals[i] / mx) * 100 : 0}%`, background: "var(--accent)", borderRadius: 9 }} /></div>
        </div>
      ))}
    </div>
  );
}

/* ---- Habit tracker (interactivo) ---- */
function HabitTracker({ state, setState }) {
  const setVal = (id, v) => setState((s) => ({ ...s, habitos: s.habitos.map((h) => h.id === id ? { ...h, hoy: Math.max(0, +v.toFixed(2)) } : h) }));
  const addAuto = () => setState((s) => ({ ...s, autocuidado: [...s.autocuidado, { id: "ac" + Date.now(), texto: "", done: false }] }));
  const updAuto = (id, txt) => setState((s) => ({ ...s, autocuidado: s.autocuidado.map((a) => a.id === id ? { ...a, texto: txt } : a) }));
  const toggleAuto = (id) => setState((s) => ({ ...s, autocuidado: s.autocuidado.map((a) => a.id === id ? { ...a, done: !a.done } : a) }));
  const delAuto = (id) => setState((s) => ({ ...s, autocuidado: s.autocuidado.filter((a) => a.id !== id) }));

  return (
    <Card title="Habit Tracker" sub="Registra hoy — se vuelca al panel de Hábitos" icon="habitos" iconColor="green"
      right={<a className="btn ghost" href="#" onClick={(e) => { e.preventDefault(); window.__nav && window.__nav("habitos"); }}>Ver panel <Icon name="chevron" size={14} /></a>}>
      <div className="habit-grid">
        {state.habitos.map((h) => {
          const pct = h.tipo === "sino" ? (h.hoy ? 100 : 0) : h.mejorMas ? Math.min((h.hoy / h.objetivo) * 100, 100) : Math.min((h.hoy / h.objetivo) * 100, 100);
          const ok = h.mejorMas ? h.hoy >= h.objetivo : h.hoy <= h.objetivo;
          return (
            <div key={h.id} className="habit">
              <div className="habit-top">
                <span className="habit-ico" style={{ background: `color-mix(in srgb, ${tone(h.color)} 16%, transparent)`, color: tone(h.color) }}><Icon name={h.icono} size={19} /></span>
                <div>
                  <div className="habit-name">{h.nombre}</div>
                  <div className="habit-obj">{h.tipo === "sino" ? "Objetivo diario" : (h.mejorMas ? "Objetivo " : "Máx ") + h.objetivo + (h.unidad ? " " + h.unidad : "")}</div>
                </div>
                {h.tipo !== "sino" && <div className="habit-val" style={{ color: ok ? tone(h.color) : "var(--text)" }}>{h.hoy}<small>{h.unidad}</small></div>}
              </div>

              {h.tipo === "sino" ? (
                <button className={"btn " + (h.hoy ? "" : "subtle")} style={{ width: "100%", justifyContent: "center", background: h.hoy ? tone(h.color) : undefined, boxShadow: h.hoy ? "var(--glow)" : undefined }} onClick={() => setVal(h.id, h.hoy ? 0 : 1)}>
                  {h.hoy ? <><Icon name="check" size={15} color="#fff" /> Hecho hoy</> : "Marcar como hecho"}
                </button>
              ) : (
                <>
                  <div className="stepper" style={{ marginBottom: 12 }}>
                    <button className="step-btn" onClick={() => setVal(h.id, Math.max(0, h.hoy - h.paso))}><Icon name="minus" size={15} /></button>
                    <div className="progress" style={{ flex: 1 }}><i style={{ width: pct + "%", background: ok ? tone(h.color) : `color-mix(in srgb, ${tone(h.color)} 60%, var(--surface-3))` }} /></div>
                    <button className="step-btn" onClick={() => setVal(h.id, h.hoy + h.paso)}><Icon name="plus" size={15} /></button>
                  </div>
                  <div className="habit-obj" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{h.mejorMas ? "Progreso" : "Consumido"}</span>
                    <span style={{ color: ok ? tone(h.color) : "var(--muted)", fontWeight: 700 }}>{Math.round(pct)}%</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Autocuidado */}
      <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="row"><Icon name="fire" size={16} color="var(--accent-2)" /><strong style={{ fontSize: 14 }}>Actividad de autocuidado</strong><span className="muted" style={{ fontSize: 12 }}>· lo que no sueles trackear</span></div>
          <button className="btn subtle" onClick={addAuto}><Icon name="plus" size={14} /> Añadir</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {state.autocuidado.length === 0 && <div className="empty">Sin actividades de autocuidado aún.</div>}
          {state.autocuidado.map((a) => (
            <div key={a.id} className="row" style={{ gap: 12, padding: "8px 12px", background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <Check on={a.done} onClick={() => toggleAuto(a.id)} size={20} />
              <input className="inp" style={{ background: "transparent", textDecoration: a.done ? "line-through" : "none", color: a.done ? "var(--muted)" : "var(--text)" }} placeholder="¿Qué hiciste por ti?" value={a.texto} onChange={(e) => updAuto(a.id, e.target.value)} />
              <button className="icon-btn" style={{ width: 30, height: 30, border: "none", background: "transparent" }} onClick={() => delAuto(a.id)}><Icon name="trash" size={15} /></button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ---- Objetivos a trackear (filtrados por periodo) ---- */
const PERIODOS = [{ k: "diario", l: "Ob. diario" }, { k: "semanal", l: "Ob. semanal" }, { k: "mes", l: "Ob. del mes" }, { k: "año", l: "Ob. del año" }];

function ObjetivosTrack({ state, setState }) {
  const [per, setPer] = useState("diario");
  const list = state.objetivos.filter((o) => o.periodo === per);
  const bump = (id, dir) => setState((s) => ({ ...s, objetivos: s.objetivos.map((o) => o.id === id ? { ...o, progreso: Math.max(0, Math.min(100, o.progreso + dir * 10)) } : o) }));
  return (
    <Card title="Objetivos" sub="Marca avance y edición" icon="objetivos" iconColor="violet"
      right={<button className="btn ghost" onClick={() => window.__nav && window.__nav("objetivos")}>Mapa <Icon name="chevron" size={14} /></button>}>
      <div className="row wrap" style={{ gap: 8, marginBottom: 16 }}>
        {PERIODOS.map((p) => <button key={p.k} className={"chip" + (per === p.k ? " on" : "")} onClick={() => setPer(p.k)}>{p.l}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((o) => {
          const cat = ORB.categorias[o.cat];
          return (
            <div key={o.id} style={{ padding: 12, borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div className="row between" style={{ marginBottom: 8 }}>
                <div className="row" style={{ gap: 8 }}>
                  <span className="dot" style={{ background: tone(cat.color) }} />
                  <strong style={{ fontSize: 13.5 }}>{o.titulo}</strong>
                </div>
                <span className="pill" style={{ background: `color-mix(in srgb, ${tone(cat.color)} 14%, transparent)`, color: tone(cat.color) }}>{cat.label}</span>
              </div>
              <div className="row" style={{ gap: 10 }}>
                <div className="progress" style={{ flex: 1 }}><i style={{ width: o.progreso + "%", background: tone(cat.color) }} /></div>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, minWidth: 38, textAlign: "right" }}>{o.progreso}%</span>
                <button className="step-btn" style={{ width: 28, height: 28 }} onClick={() => bump(o.id, -1)}><Icon name="minus" size={13} /></button>
                <button className="step-btn" style={{ width: 28, height: 28 }} onClick={() => bump(o.id, 1)}><Icon name="plus" size={13} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ---- Frase del mes ---- */
function Frase({ state }) {
  return (
    <Card className="frase">
      <div className="eyebrow" style={{ marginBottom: 14 }}>Frase del mes · {ORB.MESES[ORB.hoy().getMonth()]}</div>
      <div className="q">“{state.frase.texto}”</div>
      <div className="a">— {state.frase.autor}</div>
    </Card>
  );
}

/* ===================== VISTA HOY ===================== */
function VistaHoy({ state, setState }) {
  const [vista, setVista] = useState(state.ajustes.vistaAgenda || "dia");
  const [tab, setTab] = useState("diario"); // objetivo diario/semanal (encabezado)
  const [toast, show] = useToast();
  const d = ORB.hoy();

  const hechas = state.agenda.filter((a) => a.done).length;
  const pct = Math.round((hechas / state.agenda.length) * 100);

  const VIEWS = [{ k: "dia", l: "Día" }, { k: "semana", l: "Semana" }, { k: "mes", l: "Mes" }, { k: "año", l: "Año" }];

  return (
    <div className="view grid" style={{ gap: "var(--gap)" }}>
      {toast}

      {/* resumen */}
      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr 1fr", gap: "var(--gap)" }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Ring value={pct} size={88} color="violet" sub="del día" />
          <div>
            <div className="eyebrow">Progreso de hoy</div>
            <h2 style={{ fontSize: 19, margin: "6px 0 4px" }}>{hechas} de {state.agenda.length} actividades</h2>
            <div className="muted" style={{ fontSize: 13 }}>{pct >= 100 ? "¡Día completado! 🎯" : pct >= 60 ? "Buen ritmo, sigue así." : "Aún queda jornada por delante."}</div>
          </div>
        </Card>
        <Card style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="kpi"><span className="n" style={{ color: "var(--accent-2)" }}>{state.usuario.racha}</span><span className="l">Días de racha 🔥</span></div>
        </Card>
        <Card style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="kpi"><span className="n" style={{ color: "var(--green)" }}>{state.habitos.filter(h => h.mejorMas ? h.hoy >= h.objetivo : h.hoy <= h.objetivo).length}/{state.habitos.length}</span><span className="l">Hábitos en verde hoy</span></div>
        </Card>
      </div>

      {/* Agenda */}
      <Card>
        <div className="card-h" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="seg" style={{ marginRight: 4 }}>
            {["diario", "semanal"].map((t) => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>Objetivo {t}</button>)}
          </div>
          <div>
            <h2 style={{ fontSize: 16 }}>Actividades · {vista === "dia" ? ORB.fechaLarga(d) : vista === "semana" ? "esta semana" : vista === "mes" ? ORB.MESES[d.getMonth()] : d.getFullYear()}</h2>
          </div>
          <div className="spacer" style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <div className="seg">{VIEWS.map((v) => <button key={v.k} className={vista === v.k ? "on" : ""} onClick={() => setVista(v.k)}>{v.l}</button>)}</div>
            <button className="icon-btn" title="Imprimir agenda" onClick={() => window.print()}><Icon name="print" size={18} /></button>
            <button className="icon-btn" title="Compartir como imagen" onClick={() => show("Imagen de la agenda preparada para compartir")}><Icon name="share" size={18} /></button>
          </div>
        </div>
        {vista === "dia" && <AgendaDia state={state} setState={setState} show={show} />}
        {vista === "semana" && <AgendaSemana state={state} />}
        {vista === "mes" && <AgendaMes />}
        {vista === "año" && <AgendaAno />}
      </Card>

      {/* Objetivos + accesos */}
      <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr", gap: "var(--gap)", alignItems: "start" }}>
        <ObjetivosTrack state={state} setState={setState} />
        <Accesos />
      </div>

      {/* Habit tracker */}
      <HabitTracker state={state} setState={setState} />

      {/* Frase */}
      <Frase state={state} />
    </div>
  );
}

Object.assign(window, { VistaHoy, Accesos, HabitTracker, LAUNCHERS });
