/* ====================================================================
   views_ajustes.jsx — Vista "Ajustes": preferencias del usuario
   (tema, objetivos, hábitos a trackear, frase del mes, reset).
   ==================================================================== */
function VistaAjustes({ state, setState, theme, setTheme }) {
  const updFrase = (f, v) => setState((s) => ({ ...s, frase: { ...s.frase, [f]: v } }));
  const updObj = (id, f, v) => setState((s) => ({ ...s, objetivos: s.objetivos.map((o) => o.id === id ? { ...o, [f]: v } : o) }));
  const delObj = (id) => setState((s) => ({ ...s, objetivos: s.objetivos.filter((o) => o.id !== id) }));
  const addObj = () => setState((s) => ({ ...s, objetivos: [...s.objetivos, { id: "o" + Date.now(), periodo: "diario", titulo: "Nuevo objetivo", cat: "mente", progreso: 0, vinc: ["mente"] }] }));
  const updHab = (id, f, v) => setState((s) => ({ ...s, habitos: s.habitos.map((h) => h.id === id ? { ...h, [f]: v } : h) }));

  const reset = () => { if (confirm("¿Restablecer todos los datos de ejemplo? Se perderán tus cambios.")) { const fresh = ORB.freshState(); fresh.ajustes.tema = theme; setState(fresh); } };

  return (
    <div className="view grid" style={{ gap: "var(--gap)", maxWidth: 820 }}>
      <div>
        <div className="eyebrow">Ajustes</div>
        <h1 style={{ fontSize: 24, marginTop: 4 }}>Personaliza tu Órbita</h1>
        <div className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Pequeños cambios sin afectar tus registros.</div>
      </div>

      {/* Apariencia */}
      <Card title="Apariencia" icon="ajustes" iconColor="violet">
        <div className="row between">
          <div><strong style={{ fontSize: 14 }}>Tema</strong><div className="muted" style={{ fontSize: 12.5 }}>Claro de día, oscuro de noche.</div></div>
          <div className="seg">
            <button className={theme === "claro" ? "on" : ""} onClick={() => setTheme("claro")}><Icon name="sun" size={15} /></button>
            <button className={theme === "oscuro" ? "on" : ""} onClick={() => setTheme("oscuro")}><Icon name="moon" size={15} /></button>
          </div>
        </div>
        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>Más opciones de color, densidad y tema espacial en el panel de <strong>Tweaks</strong> (barra superior).</div>
      </Card>

      {/* Objetivos */}
      <Card title="Objetivos a trackear" sub="Edita títulos, área y periodo" icon="objetivos" iconColor="green"
        right={<button className="btn subtle" onClick={addObj}><Icon name="plus" size={14} /> Nuevo</button>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {state.objetivos.map((o) => (
            <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, alignItems: "center" }}>
              <input className="inp" value={o.titulo} onChange={(e) => updObj(o.id, "titulo", e.target.value)} />
              <select className="inp" style={{ width: 120 }} value={o.cat} onChange={(e) => updObj(o.id, "cat", e.target.value)}>
                {Object.entries(ORB.categorias).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
              <select className="inp" style={{ width: 110 }} value={o.periodo} onChange={(e) => updObj(o.id, "periodo", e.target.value)}>
                {["diario", "semanal", "mes", "año"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <button className="icon-btn" style={{ width: 34, height: 34, border: "none", background: "transparent" }} onClick={() => delObj(o.id)}><Icon name="trash" size={15} /></button>
            </div>
          ))}
        </div>
      </Card>

      {/* Hábitos */}
      <Card title="Hábitos a trackear" sub="Ajusta tus objetivos diarios" icon="habitos" iconColor="blue">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {state.habitos.map((h) => (
            <div key={h.id} className="row between" style={{ padding: "8px 12px", background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div className="row" style={{ gap: 10 }}>
                <span className="habit-ico" style={{ width: 30, height: 30, background: `color-mix(in srgb, ${tone(h.color)} 16%, transparent)`, color: tone(h.color) }}><Icon name={h.icono} size={16} /></span>
                <strong style={{ fontSize: 13.5 }}>{h.nombre}</strong>
              </div>
              {h.tipo === "sino" ? <span className="muted" style={{ fontSize: 12.5 }}>Sí / No diario</span> : (
                <div className="row" style={{ gap: 8 }}>
                  <span className="muted" style={{ fontSize: 12.5 }}>{h.mejorMas ? "Meta" : "Máx"}</span>
                  <button className="step-btn" style={{ width: 30, height: 30 }} onClick={() => updHab(h.id, "objetivo", Math.max(h.paso, +(h.objetivo - h.paso).toFixed(2)))}><Icon name="minus" size={13} /></button>
                  <strong style={{ fontFamily: "var(--font-display)", minWidth: 56, textAlign: "center" }}>{h.objetivo} {h.unidad}</strong>
                  <button className="step-btn" style={{ width: 30, height: 30 }} onClick={() => updHab(h.id, "objetivo", +(h.objetivo + h.paso).toFixed(2))}><Icon name="plus" size={13} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Frase */}
      <Card title="Frase del mes" sub="Se muestra en tu inicio" icon="spark" iconColor="amber">
        <textarea className="inp" rows="2" style={{ marginBottom: 10, fontFamily: "var(--font-display)", fontSize: 15 }} value={state.frase.texto} onChange={(e) => updFrase("texto", e.target.value)} />
        <input className="inp" placeholder="Autor" value={state.frase.autor} onChange={(e) => updFrase("autor", e.target.value)} />
      </Card>

      {/* Datos */}
      <Card title="Datos" icon="ajustes" iconColor="red">
        <div className="row between">
          <div><strong style={{ fontSize: 14 }}>Restablecer ejemplo</strong><div className="muted" style={{ fontSize: 12.5 }}>Vuelve a los datos de muestra originales.</div></div>
          <button className="btn subtle" style={{ color: "var(--red)" }} onClick={reset}><Icon name="trash" size={14} /> Restablecer</button>
        </div>
      </Card>
    </div>
  );
}
Object.assign(window, { VistaAjustes });
