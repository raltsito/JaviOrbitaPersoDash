/* Iconos SVG compartidos — migrados de Javier/components.jsx */
export default function Icon({ name, size = 20, stroke = 1.8, fill = 'none', color = 'currentColor', style }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill, stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', style }
  switch (name) {
    case 'hoy': return (<svg {...p}><rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="M8 14h4" strokeWidth={2.2}/></svg>)
    case 'analisis': return (<svg {...p}><path d="M4 19V5M4 19h16"/><path d="M8 16l3.5-4 3 2.5L20 8"/></svg>)
    case 'habitos': return (<svg {...p}><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"/></svg>)
    case 'conexiones': return (<svg {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.3 2.6-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><circle cx="17.5" cy="9" r="2.4"/><path d="M16 14.4c2.6.3 4.5 2.2 4.5 4.6"/></svg>)
    case 'objetivos': return (<svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill={color}/></svg>)
    case 'ajustes': return (<svg {...p}><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7.7 2 2 0 01-3.8 0 1.6 1.6 0 00-2.7-.7l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 004.6 13a2 2 0 010-3.8 1.6 1.6 0 00.7-2.7l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 002.7-.7 2 2 0 013.8 0 1.6 1.6 0 002.7.7l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00.7 2.7 2 2 0 010 3.8z"/></svg>)
    case 'check': return (<svg {...p}><path d="M4 12.5l5 5L20 6.5" strokeWidth={2.6}/></svg>)
    case 'plus': return (<svg {...p}><path d="M12 5v14M5 12h14" strokeWidth={2.2}/></svg>)
    case 'minus': return (<svg {...p}><path d="M5 12h14" strokeWidth={2.2}/></svg>)
    case 'sun': return (<svg {...p}><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>)
    case 'moon': return (<svg {...p}><path d="M21 12.8A8.5 8.5 0 1111.2 3a6.6 6.6 0 009.8 9.8z"/></svg>)
    case 'menu': return (<svg {...p}><path d="M4 6h16M4 12h16M4 18h16" strokeWidth={2}/></svg>)
    case 'print': return (<svg {...p}><path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 17h10v4H7z"/><circle cx="17" cy="12.5" r=".8" fill={color} stroke="none"/></svg>)
    case 'share': return (<svg {...p}><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.1 11l7.8-4M8.1 13l7.8 4"/></svg>)
    case 'edit': return (<svg {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2 2 0 012.8 2.8L7 18.9 3 20l1.1-4z"/></svg>)
    case 'trash': return (<svg {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>)
    case 'plusc': return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8" strokeWidth={2}/></svg>)
    case 'chevron': return (<svg {...p}><path d="M9 6l6 6-6 6"/></svg>)
    case 'fire': return (<svg {...p} fill={color} stroke="none"><path d="M12 2c1 3-1.5 4-1.5 6.5C10.5 10 11.5 11 12 11c.8 0 1.5-1 1.3-2.3C15 9.5 16 11.4 16 13.5A4 4 0 018 14c0-2 1-3 1.3-4C9.6 11 10 11.5 10 11.5 9 9 12 6 12 2z"/></svg>)
    case 'spark': return (<svg {...p}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" strokeWidth={1.6}/></svg>)
    /* hábitos */
    case 'drop': return (<svg {...p}><path d="M12 3s6 6.3 6 10.5A6 6 0 016 13.5C6 9.3 12 3 12 3z"/></svg>)
    case 'stretch': return (<svg {...p}><circle cx="12" cy="4.5" r="1.8"/><path d="M12 7v6M12 9l-4 2M12 9l4 2M12 13l-3 6M12 13l3 6"/></svg>)
    case 'smoke': return (<svg {...p}><rect x="3" y="13" width="14" height="4" rx="1"/><path d="M17 13v4M14 13v4"/><path d="M16 9c1.5-.8 1.5-2.2 0-3M19 10c2-1 2-3 0-4"/></svg>)
    case 'run': return (<svg {...p}><circle cx="14" cy="4.5" r="1.8"/><path d="M13.5 7l-3 2.5 2 2.5 1 5M10.5 9.5L7 11M11 17l-2.5 3M15.5 12l3 1.5"/></svg>)
    case 'lotus': return (<svg {...p}><path d="M12 4c2 2.5 2 5 0 7-2-2-2-4.5 0-7z"/><path d="M12 11c-1-3-4-4-6-4 0 3 2.5 5 6 4zM12 11c1-3 4-4 6-4 0 3-2.5 5-6 4z"/><path d="M5 11c-1 1.5-1 3.5 7 5 8-1.5 8-3.5 7-5"/></svg>)
    case 'apple': return (<svg {...p}><path d="M12 7c-2-2-6-1.5-6 3 0 4 3 8 6 8s6-4 6-8c0-4.5-4-5-6-3z"/><path d="M12 7c0-2 1-3 3-3.5"/></svg>)
    /* launchers */
    case 'ai': return (<svg {...p}><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" strokeWidth={1.5}/></svg>)
    case 'music': return (<svg {...p}><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M9 17.5V6l11-2v9.5"/></svg>)
    case 'play': return (<svg {...p} fill={color} stroke="none"><path d="M8 6.5v11l9-5.5z"/></svg>)
    case 'design': return (<svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/></svg>)
    case 'logout': return (<svg {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>)
    case 'calendar': return (<svg {...p}><rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>)
    default: return null
  }
}
