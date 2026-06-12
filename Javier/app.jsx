/* ====================================================================
   app.jsx — Shell: sidebar, topbar, routing, estado global, tema, tweaks
   ==================================================================== */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#7c5cfc",
  "density": "regular",
  "space": false
}/*EDITMODE-END*/;

const NAV = [
  { k: "hoy", l: "Hoy", ico: "hoy" },
  { k: "analisis", l: "Análisis", ico: "analisis" },
  { k: "habitos", l: "Hábitos", ico: "habitos" },
  { k: "conexiones", l: "Conexiones", ico: "conexiones" },
  { k: "objetivos", l: "Objetivos", ico: "objetivos" },
  { k: "ajustes", l: "Ajustes", ico: "ajustes" },
];

const TITULOS = {
  hoy: { t: "Buenos días, Javier", s: null },
  analisis: { t: "Análisis", s: "Tu progreso, visto de cerca" },
  habitos: { t: "Hábitos", s: "Constancia diaria" },
  conexiones: { t: "Conexiones", s: "Las personas que importan" },
  objetivos: { t: "Objetivos", s: "Hacia dónde apuntas" },
  ajustes: { t: "Ajustes", s: "Tu Órbita, a tu manera" },
};

const DENSITY = {
  compact: { "--fs-base": "14px", "--gap": "16px", "--card-pad": "16px" },
  regular: { "--fs-base": "15px", "--gap": "22px", "--card-pad": "22px" },
  comfy: { "--fs-base": "16.5px", "--gap": "28px", "--card-pad": "26px" },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [state, setState] = useState(() => ORB.load() || ORB.freshState());
  const [route, setRoute] = useState("hoy");
  const [theme, setThemeRaw] = useState(state.ajustes.tema || "claro");
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("orbita_collapsed") === "1");
  useEffect(() => { localStorage.setItem("orbita_collapsed", collapsed ? "1" : "0"); }, [collapsed]);

  // toggle: móvil abre overlay, escritorio colapsa el rail
  const toggleSidebar = () => { if (window.matchMedia("(max-width: 880px)").matches) setMenuOpen((v) => !v); else setCollapsed((v) => !v); };

  // persistencia
  useEffect(() => { ORB.save(state); }, [state]);

  // saludo según hora
  const hora = ORB.hoy().getHours();
  const saludo = hora < 6 ? "Aún despierto, Javier" : hora < 13 ? "Buenos días, Javier" : hora < 20 ? "Buenas tardes, Javier" : "Buenas noches, Javier";

  // tema
  const setTheme = (v) => { setThemeRaw(v); setState((s) => ({ ...s, ajustes: { ...s.ajustes, tema: v } })); };
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  // tweaks -> css vars / body
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent", t.accent);
    r.style.setProperty("--accent-press", t.accent);
    const d = DENSITY[t.density] || DENSITY.regular;
    Object.entries(d).forEach(([k, v]) => r.style.setProperty(k, v));
    document.body.classList.toggle("space", !!t.space);
  }, [t.accent, t.density, t.space]);

  // navegación global (botones dentro de vistas)
  useEffect(() => { window.__nav = (k) => { setRoute(k); window.scrollTo({ top: 0 }); }; }, []);

  const go = (k) => { setRoute(k); setMenuOpen(false); window.scrollTo({ top: 0 }); };

  const props = { state, setState, theme, setTheme };
  const View = { hoy: VistaHoy, analisis: VistaAnalisis, habitos: VistaHabitos, conexiones: VistaConexiones, objetivos: VistaObjetivos, ajustes: VistaAjustes }[route];

  const ti = TITULOS[route];
  const titulo = route === "hoy" ? saludo : ti.t;

  return (
    <div className={"app" + (collapsed ? " collapsed" : "")}>
      {/* SIDEBAR */}
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}
      <aside className={"sidebar" + (menuOpen ? " open" : "")}>
        <div className="brand">
          <Logo size={38} />
          <div>
            <div className="brand-name">Órbita</div>
            <div className="brand-sub">Dashboard personal</div>
          </div>
          <button className="collapse-btn" onClick={() => setCollapsed((v) => !v)} title={collapsed ? "Expandir" : "Colapsar"}><Icon name="chevron" size={16} /></button>
        </div>

        <div className="nav-label">Tablero</div>
        {NAV.slice(0, 1).map((n) => <NavItem key={n.k} n={n} active={route === n.k} onClick={() => go(n.k)} />)}

        <div className="nav-label">Paneles</div>
        {NAV.slice(1, 5).map((n) => <NavItem key={n.k} n={n} active={route === n.k} onClick={() => go(n.k)} />)}

        <div className="nav-label">Sistema</div>
        {NAV.slice(5).map((n) => <NavItem key={n.k} n={n} active={route === n.k} onClick={() => go(n.k)} />)}

        <div className="sidebar-foot">
          <div className="streak">
            <Icon name="fire" size={26} color="var(--accent-2)" />
            <div><div className="streak-n">{state.usuario.racha}</div><div className="streak-l">días de racha</div></div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={toggleSidebar}><Icon name="menu" size={20} /></button>
          <div>
            <h1>{titulo}</h1>
            <div className="sub">{route === "hoy" ? ORB.fechaLarga(ORB.hoy()) : ti.s}</div>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" title={theme === "claro" ? "Modo oscuro" : "Modo claro"} onClick={() => setTheme(theme === "claro" ? "oscuro" : "claro")}>
              <Icon name={theme === "claro" ? "moon" : "sun"} size={19} />
            </button>
          </div>
        </header>
        <main className="content">
          <View {...props} />
        </main>
      </div>

      {/* TWEAKS */}
      <TweaksPanel>
        <TweakSection label="Apariencia" />
        <TweakColor label="Color de acento" value={t.accent}
          options={["#7c5cfc", "#7c4fc4", "#2a6fdb", "#1f8a5b", "#e0578a"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakRadio label="Densidad" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />
        <TweakToggle label="Tema espacial" value={t.space} onChange={(v) => setTweak("space", v)} />
      </TweaksPanel>
    </div>
  );
}

function NavItem({ n, active, onClick }) {
  return (
    <button className={"nav-item" + (active ? " active" : "")} onClick={onClick} title={n.l}>
      <Icon name={n.ico} size={19} /> <span className="nav-text">{n.l}</span>
    </button>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
