/* ====================================================================
   views_habitos.jsx — Vista "Hábitos": gráficas por hábito + semáforo
   de logro (verde / ámbar / rojo).
   ==================================================================== */
function semaforo(h, hist) {
  // % de días que cumplieron el objetivo en la semana
  const dias = hist.length;
  const ok = hist.filter((v) => (h.tipo === "sino" ? v >= 1 : h.mejorMas ? v >= h.objetivo : v <= h.objetivo)).length;
  const ratio = ok / dias;
  if (ratio >= 0.7) return { color: "green", label: "En meta", txt: `${ok}/${dias} días` };
  if (ratio >= 0.4) return { color: "amber", label: "A medias", txt: `${ok}/${dias} días` };
  return { color: "red", label: "Atención", txt: `${ok}/${dias} días` };
}

function VistaHabitos({ state }) {
  const hist = ORB.series.histHabitos;
  const enVerde = state.habitos.filter((h) => semaforo(h, hist[h.id]).color === "green").length;

  return (
    <div className="view grid" style={{ gap: "var(--gap)" }}>
      <div className="row between wrap" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow">Hábitos</div>
          <h1 style={{ fontSize: 24, marginTop: 4 }}>Tus hábitos esta semana</h1>
        </div>
        <button className="btn ghost" onClick={() => window.__nav && window.__nav("hoy")}><Icon name="edit" size={15} /> Registrar en el tracker</button>
      </div>

      {/* resumen semáforo */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: "var(--gap)" }}>
        {[["green", "En meta", enVerde], ["amber", "A medias", state.habitos.filter((h) => semaforo(h, hist[h.id]).color === "amber").length], ["red", "Necesitan atención", state.habitos.filter((h) => semaforo(h, hist[h.id]).color === "red").length]].map(([c, l, n]) => (
          <Card key={l} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="dot" style={{ width: 16, height: 16, background: tone(c), boxShadow: `0 0 12px ${tone(c)}` }} />
            <div className="kpi"><span className="n" style={{ fontSize: 26 }}>{n}</span><span className="l">{l}</span></div>
          </Card>
        ))}
      </div>

      {/* tarjetas por hábito */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: "var(--gap)" }}>
        {state.habitos.map((h) => {
          const series = hist[h.id];
          const sem = semaforo(h, series);
          const prom = (series.reduce((a, b) => a + b, 0) / series.length);
          return (
            <Card key={h.id}>
              <div className="card-h">
                <span className="habit-ico" style={{ background: `color-mix(in srgb, ${tone(h.color)} 16%, transparent)`, color: tone(h.color) }}><Icon name={h.icono} size={19} /></span>
                <div>
                  <h3>{h.nombre}</h3>
                  <div className="sub">{h.tipo === "sino" ? "Objetivo diario" : (h.mejorMas ? "Meta " : "Máx ") + h.objetivo + (h.unidad ? " " + h.unidad : "")}</div>
                </div>
                <span className="spacer pill" style={{ marginLeft: "auto", background: `color-mix(in srgb, ${tone(sem.color)} 16%, transparent)`, color: tone(sem.color) }}>
                  <span className="dot" style={{ background: tone(sem.color) }} /> {sem.label}
                </span>
              </div>
              <BarChart data={series} labels={ORB.DIAS} color={h.color} target={h.tipo === "sino" ? 1 : h.objetivo} height={120} />
              <div className="row between" style={{ marginTop: 12, fontSize: 12.5 }}>
                <span className="muted">Media: <strong style={{ color: "var(--text)" }}>{h.tipo === "sino" ? Math.round(prom * 100) + "%" : prom.toFixed(1) + (h.unidad ? " " + h.unidad : "")}</strong></span>
                <span className="muted">{sem.txt}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* autocuidado registrado */}
      <Card title="Autocuidado registrado" sub="Actividades adicionales del tracker" icon="fire" iconColor="amber">
        {state.autocuidado.filter((a) => a.texto).length === 0
          ? <div className="empty">Las actividades de autocuidado que registres en el tracker aparecerán aquí.</div>
          : <div className="row wrap" style={{ gap: 10 }}>
            {state.autocuidado.filter((a) => a.texto).map((a) => (
              <span key={a.id} className="pill" style={{ padding: "8px 14px", background: a.done ? "color-mix(in srgb, var(--green) 14%, transparent)" : "var(--surface-2)", color: a.done ? "var(--green)" : "var(--muted)", border: "1px solid var(--border)" }}>
                {a.done && <Icon name="check" size={13} color="var(--green)" />} {a.texto}
              </span>
            ))}
          </div>}
      </Card>
    </div>
  );
}
Object.assign(window, { VistaHabitos });
