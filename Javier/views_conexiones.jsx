/* ====================================================================
   views_conexiones.jsx — Vista "Conexiones": lista editable de personas
   con check, último contacto y notas.
   ==================================================================== */
function VistaConexiones({ state, setState }) {
  const upd = (id, f, v) => setState((s) => ({ ...s, conexiones: s.conexiones.map((c) => c.id === id ? { ...c, [f]: v } : c) }));
  const toggle = (id) => setState((s) => ({ ...s, conexiones: s.conexiones.map((c) => c.id === id ? { ...c, check: !c.check } : c) }));
  const del = (id) => setState((s) => ({ ...s, conexiones: s.conexiones.filter((c) => c.id !== id) }));
  const add = () => setState((s) => ({ ...s, conexiones: [...s.conexiones, { id: "c" + Date.now(), nombre: "", relacion: "", check: false, ultimo: "Hoy", notas: "" }] }));

  const contactados = state.conexiones.filter((c) => c.check).length;
  const colorFor = (n) => ["violet", "blue", "green", "amber", "mint", "red"][(n || "x").charCodeAt(0) % 6];

  return (
    <div className="view grid" style={{ gap: "var(--gap)" }}>
      <div className="row between wrap" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow">Conexiones personales</div>
          <h1 style={{ fontSize: 24, marginTop: 4 }}>Tu círculo cercano</h1>
        </div>
        <button className="btn" onClick={add}><Icon name="plus" size={15} /> Añadir persona</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: "var(--gap)" }}>
        <Card style={{ display: "flex", flexDirection: "column", gap: 4 }}><div className="kpi"><span className="n" style={{ color: "var(--accent)" }}>{state.conexiones.length}</span><span className="l">Personas en tu lista</span></div></Card>
        <Card style={{ display: "flex", flexDirection: "column", gap: 4 }}><div className="kpi"><span className="n" style={{ color: "var(--green)" }}>{contactados}</span><span className="l">Contactadas esta semana</span></div></Card>
        <Card style={{ display: "flex", flexDirection: "column", gap: 4 }}><div className="kpi"><span className="n" style={{ color: "var(--accent-2)" }}>{state.conexiones.length - contactados}</span><span className="l">Pendientes de retomar</span></div></Card>
      </div>

      <Card title="Lista editable" sub="Marca a quién ya contactaste y deja notas" icon="conexiones" iconColor="blue">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.conexiones.map((c) => {
            const col = colorFor(c.nombre);
            const ini = (c.nombre || "·").trim().charAt(0).toUpperCase();
            return (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "auto 1.1fr 1.4fr auto auto", gap: 14, alignItems: "center", padding: 12, borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div className="row" style={{ gap: 12 }}>
                  <Check on={c.check} onClick={() => toggle(c.id)} size={22} />
                  <span style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff", background: tone(col), flex: "0 0 auto" }}>{ini}</span>
                </div>
                <div>
                  <input className="inp" style={{ background: "transparent", fontWeight: 700, padding: "2px 6px", fontFamily: "var(--font-display)" }} placeholder="Nombre" value={c.nombre} onChange={(e) => upd(c.id, "nombre", e.target.value)} />
                  <input className="inp" style={{ background: "transparent", color: "var(--muted)", padding: "2px 6px", fontSize: 12.5 }} placeholder="Relación" value={c.relacion} onChange={(e) => upd(c.id, "relacion", e.target.value)} />
                </div>
                <input className="inp" placeholder="Notas — recordatorios, cumpleaños…" value={c.notas} onChange={(e) => upd(c.id, "notas", e.target.value)} />
                <span className="pill" style={{ background: "var(--surface-3)", color: "var(--muted)", whiteSpace: "nowrap" }}>{c.ultimo}</span>
                <button className="icon-btn" style={{ width: 32, height: 32, border: "none", background: "transparent" }} onClick={() => del(c.id)}><Icon name="trash" size={15} /></button>
              </div>
            );
          })}
          {state.conexiones.length === 0 && <div className="empty">Añade a las personas que quieres cuidar.</div>}
        </div>
      </Card>
    </div>
  );
}
Object.assign(window, { VistaConexiones });
