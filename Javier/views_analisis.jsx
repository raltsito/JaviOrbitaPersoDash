/* ====================================================================
   views_analisis.jsx — Vista "Análisis": gráficas de actividades y
   objetivos alcanzados por día/semana/mes/año.
   ==================================================================== */
function VistaAnalisis({ state }) {
  const [per, setPer] = useState("semana");
  const d = ORB.hoy();
  const hechas = state.agenda.filter((a) => a.done).length;
  const pctDia = Math.round((hechas / state.agenda.length) * 100);

  // métricas por periodo
  const objAll = state.objetivos;
  const cumplidos = (lst) => Math.round(lst.reduce((a, o) => a + o.progreso, 0) / (lst.length || 1));
  const porPeriodo = {
    semana: cumplidos(objAll.filter((o) => o.periodo === "semanal")),
    mes: cumplidos(objAll.filter((o) => o.periodo === "mes")),
    año: cumplidos(objAll.filter((o) => o.periodo === "año")),
  };

  return (
    <div className="view grid" style={{ gap: "var(--gap)" }}>
      <div className="row between wrap" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow">Análisis</div>
          <h1 style={{ fontSize: 24, marginTop: 4 }}>Tu progreso en cifras</h1>
        </div>
        <div className="seg">{[["semana", "Semana"], ["mes", "Mes"], ["año", "Año"]].map(([k, l]) => <button key={k} className={per === k ? "on" : ""} onClick={() => setPer(k)}>{l}</button>)}</div>
      </div>

      {/* KPIs */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", gap: "var(--gap)" }}>
        {[
          { n: pctDia + "%", l: "Día completado", c: "violet", ico: "hoy" },
          { n: porPeriodo[per] + "%", l: "Objetivos del " + (per === "año" ? "año" : per), c: "green", ico: "objetivos" },
          { n: state.usuario.racha, l: "Días de racha", c: "amber", ico: "fire" },
          { n: "1.250", l: "Actividades en el año", c: "blue", ico: "analisis" },
        ].map((k) => (
          <Card key={k.l} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="habit-ico" style={{ background: `color-mix(in srgb, ${tone(k.c)} 16%, transparent)`, color: tone(k.c) }}><Icon name={k.ico} size={18} /></span>
            <div className="kpi"><span className="n" style={{ color: tone(k.c) }}>{k.n}</span><span className="l">{k.l}</span></div>
          </Card>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", gap: "var(--gap)", alignItems: "start" }}>
        {/* gráfica principal */}
        <Card title={per === "semana" ? "Actividades completadas por día" : per === "mes" ? "Cumplimiento mensual" : "Actividades por mes"}
          sub={per === "semana" ? "Últimos 7 días (%)" : per === "mes" ? "% de objetivos alcanzados" : "Conteo anual"} icon="analisis" iconColor="violet">
          {per === "semana" && <BarChart data={ORB.series.actividadesSemana} labels={ORB.DIAS} color="violet" target={80} max={100} height={190} />}
          {per === "mes" && <LineChart data={ORB.series.objetivosMes} labels={ORB.MESES.map((m) => m.slice(0, 1).toUpperCase())} color="green" height={200} />}
          {per === "año" && <BarChart data={ORB.series.actividadesPorMes} labels={ORB.MESES.map((m) => m.slice(0, 1).toUpperCase())} color="blue" height={200} />}
          <div className="row" style={{ gap: 18, marginTop: 14, fontSize: 12 }}>
            <span className="row" style={{ gap: 6 }}><span className="dot" style={{ background: "var(--accent)" }} /> Logrado</span>
            <span className="row" style={{ gap: 6 }}><span style={{ width: 16, height: 0, borderTop: "2px dashed var(--border-strong)" }} /> Meta</span>
          </div>
        </Card>

        {/* objetivos por categoría */}
        <Card title="Por categoría de vida" sub="Avance medio" icon="objetivos" iconColor="green">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(ORB.categorias).map(([k, c]) => {
              const lst = objAll.filter((o) => o.cat === k);
              const avg = cumplidos(lst);
              return (
                <div key={k}>
                  <div className="row between" style={{ marginBottom: 6 }}>
                    <span className="row" style={{ gap: 8 }}><span className="dot" style={{ background: tone(c.color) }} /><strong style={{ fontSize: 13 }}>{c.label}</strong></span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>{avg}%</span>
                  </div>
                  <div className="progress"><i style={{ width: avg + "%", background: tone(c.color) }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* objetivos alcanzados a lo largo del año */}
      <Card title="Objetivos alcanzados durante el año" sub="% mensual de cumplimiento" icon="analisis" iconColor="blue">
        <LineChart data={ORB.series.objetivosMes} labels={ORB.MESES.map((m) => m.slice(0, 3))} color="violet" height={180} />
      </Card>
    </div>
  );
}
Object.assign(window, { VistaAnalisis });
