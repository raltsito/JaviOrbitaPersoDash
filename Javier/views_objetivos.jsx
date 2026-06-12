/* ====================================================================
   views_objetivos.jsx — Vista "Objetivos": mapa orbital de relación
   entre objetivos, categorías de vida y actividades.
   ==================================================================== */
function VistaObjetivos({ state }) {
  const [sel, setSel] = useState(null); // categoría seleccionada
  const cats = Object.entries(ORB.categorias); // [k, {label,color}]
  const W = 980, H = 660, cx = W / 2, cy = H / 2;
  const R1 = 196; // radio categorías

  // posiciones de categorías
  const catPos = {};
  cats.forEach(([k], i) => {
    const ang = (i / cats.length) * Math.PI * 2 - Math.PI / 2;
    catPos[k] = { x: cx + Math.cos(ang) * R1, y: cy + Math.sin(ang) * R1, ang };
  });

  // objetivos por categoría: fan radial hacia afuera del hub, en dos anillos
  const nodos = [];
  cats.forEach(([k]) => {
    const list = state.objetivos.filter((o) => o.cat === k);
    const n = list.length;
    const step = 0.52;                 // separación angular por objetivo
    list.forEach((o, j) => {
      const base = catPos[k].ang;       // dirección hacia afuera
      const a = base + (j - (n - 1) / 2) * step;
      const r = 96 + (j % 2) * 44;      // dos anillos para evitar solapes
      const x = catPos[k].x + Math.cos(a) * r;
      const y = catPos[k].y + Math.sin(a) * r;
      // la etiqueta se desplaza radialmente hacia afuera del centro
      const ux = (x - cx), uy = (y - cy), m = Math.hypot(ux, uy) || 1;
      nodos.push({ ...o, x, y, lx: x + (ux / m) * 12, ly: y + (uy / m) * 12, side: ux >= 0 ? "start" : "end", below: uy > 12 });
    });
  });

  const dim = (k) => sel && sel !== k ? 0.16 : 1;

  return (
    <div className="view grid" style={{ gap: "var(--gap)" }}>
      <div className="row between wrap" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow">Objetivos</div>
          <h1 style={{ fontSize: 24, marginTop: 4 }}>Mapa de tus metas</h1>
          <div className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>Cómo se relacionan tus objetivos con cada área de tu vida.</div>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          <button className={"chip" + (!sel ? " on" : "")} onClick={() => setSel(null)}>Todas</button>
          {cats.map(([k, c]) => <button key={k} className={"chip" + (sel === k ? " on" : "")} onClick={() => setSel(sel === k ? null : k)} style={sel === k ? { background: tone(c.color), borderColor: tone(c.color) } : {}}>{c.label}</button>)}
        </div>
      </div>

      <Card style={{ padding: 8, overflow: "hidden", position: "relative" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
          {/* órbitas decorativas */}
          <ellipse className="orbit-deco" cx={cx} cy={cy} rx={R1 + 70} ry={R1 - 6} fill="none" stroke="var(--accent)" strokeOpacity=".12" strokeWidth="1" transform={`rotate(-18 ${cx} ${cy})`} />
          <ellipse className="orbit-deco" cx={cx} cy={cy} rx={R1 - 10} ry={R1 + 50} fill="none" stroke="var(--accent)" strokeOpacity=".1" strokeWidth="1" transform={`rotate(24 ${cx} ${cy})`} />
          <circle cx={cx} cy={cy} r={R1} fill="none" stroke="var(--border)" strokeDasharray="3 6" />

          {/* líneas centro -> categoría */}
          {cats.map(([k, c]) => <line key={"l" + k} x1={cx} y1={cy} x2={catPos[k].x} y2={catPos[k].y} stroke={tone(c.color)} strokeWidth="2" opacity={dim(k) * 0.5} />)}
          {/* líneas categoría -> objetivo */}
          {nodos.map((n) => { const c = ORB.categorias[n.cat]; return <line key={"e" + n.id} x1={catPos[n.cat].x} y1={catPos[n.cat].y} x2={n.x} y2={n.y} stroke={tone(c.color)} strokeWidth="1.5" opacity={dim(n.cat) * 0.35} />; })}

          {/* nodos objetivo */}
          {nodos.map((n) => {
            const c = ORB.categorias[n.cat];
            const r = 6 + (n.progreso / 100) * 9;
            return (
              <g key={n.id} opacity={dim(n.cat)} style={{ transition: "opacity .3s" }}>
                <circle cx={n.x} cy={n.y} r={r} fill={tone(c.color)} fillOpacity={0.25 + (n.progreso / 100) * 0.65} stroke={tone(c.color)} strokeWidth="1.5" />
                <text x={n.side === "start" ? n.x + r + 5 : n.x - r - 5} y={n.ly + (n.below ? 4 : 0)} textAnchor={n.side} fontSize="10.5" fill="var(--text)" fontFamily="var(--font-body)" style={{ pointerEvents: "none" }}>{n.titulo.length > 20 ? n.titulo.slice(0, 19) + "…" : n.titulo}</text>
              </g>
            );
          })}

          {/* hubs categoría */}
          {cats.map(([k, c]) => (
            <g key={"h" + k} opacity={dim(k)} style={{ cursor: "pointer", transition: "opacity .3s" }} onClick={() => setSel(sel === k ? null : k)}>
              <circle cx={catPos[k].x} cy={catPos[k].y} r="24" fill="var(--surface)" stroke={tone(c.color)} strokeWidth="2.5" />
              <circle cx={catPos[k].x} cy={catPos[k].y} r="24" fill={tone(c.color)} fillOpacity=".14" />
              <text x={catPos[k].x} y={catPos[k].y + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={tone(c.color)} fontFamily="var(--font-display)">{c.label}</text>
            </g>
          ))}

          {/* centro */}
          <circle cx={cx} cy={cy} r="34" fill="var(--accent)" />
          <circle cx={cx} cy={cy} r="34" fill="none" stroke="var(--accent)" strokeWidth="6" strokeOpacity=".25" />
          <text x={cx} y={cy - 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="var(--font-display)">{state.usuario.nombre}</text>
          <text x={cx} y={cy + 13} textAnchor="middle" fontSize="9" fill="#fff" fillOpacity=".8">tus metas</text>
        </svg>
        <div className="muted" style={{ fontSize: 12, textAlign: "center", paddingBottom: 8 }}>El tamaño y la intensidad de cada punto reflejan su progreso. Toca un área para enfocarla.</div>
      </Card>

      {/* listado por categoría */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: "var(--gap)" }}>
        {cats.filter(([k]) => !sel || sel === k).map(([k, c]) => (
          <Card key={k} title={c.label} sub={state.objetivos.filter((o) => o.cat === k).length + " objetivos"} icon="objetivos" iconColor={c.color}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {state.objetivos.filter((o) => o.cat === k).map((o) => (
                <div key={o.id}>
                  <div className="row between" style={{ marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{o.titulo}</span>
                    <span className="muted" style={{ fontSize: 11.5, textTransform: "capitalize" }}>{o.periodo}</span>
                  </div>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="progress" style={{ flex: 1 }}><i style={{ width: o.progreso + "%", background: tone(c.color) }} /></div>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, minWidth: 34, textAlign: "right" }}>{o.progreso}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
Object.assign(window, { VistaObjetivos });
