import { useState, useMemo, useEffect } from "react";

// ── ICONS (inline SVG micro-components) ──────────────────────────────────────
const Icon = ({ d, size = 18, stroke = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IcoDash    = () => <Icon d="M3 12h18M3 6h18M3 18h18" />;
const IcoPlus    = () => <Icon d="M12 5v14M5 12h14" />;
const IcoSettings= () => <Icon d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />;
const IcoUsers   = () => <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />;
const IcoAward   = () => <Icon d="M12 15a6 6 0 100-12 6 6 0 000 12zM8.21 13.89L7 23l5-3 5 3-1.21-9.12" />;
const IcoTrend   = () => <Icon d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" />;
const IcoTrash   = () => <Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />;
const IcoArrow   = () => <Icon d="M5 12h14M12 5l7 7-7 7" />;
const IcoCheck   = () => <Icon d="M20 6L9 17l-5-5" />;
const IcoBell    = () => <Icon d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />;
const IcoX       = () => <Icon d="M18 6L6 18M6 6l12 12" />;
const IcoStar    = () => <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const IcoFile    = () => <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />;
const IcoEdit    = () => <Icon d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />;
const IcoSearch  = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />;
const IcoExport  = () => <Icon d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const IcoImport  = () => <Icon d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />;

// ── DATA ────────────────────────────────────────────────────────────────────
const INIT_CATS = [
  { id: "leadership",    name: "Liderazgo",                color: "#CC785C" },
  { id: "communication", name: "Comunicación",             color: "#8B9EB7" },
  { id: "results",       name: "Orientación a Resultados", color: "#10b981" },
  { id: "planning",      name: "Planificación",            color: "#f59e0b" },
  { id: "soft-skills",   name: "Habilidades Blandas",      color: "#ec4899" },
];

const INIT_CRITERIA = [
  { id:"l1", category:"leadership",    label:"Motivación de equipo",            desc:"Capacidad para inspirar y motivar a sus colaboradores hacia el logro de objetivos." },
  { id:"l2", category:"leadership",    label:"Toma de decisiones",              desc:"Habilidad para elegir entre alternativas de manera eficiente y asertiva." },
  { id:"c1", category:"communication", label:"Claridad en la delegación",       desc:"Transmite instrucciones y objetivos de forma comprensible y estructurada." },
  { id:"c2", category:"communication", label:"Escucha activa",                  desc:"Demuestra interés por las opiniones y sugerencias del equipo." },
  { id:"r1", category:"results",       label:"Cumplimiento de metas",           desc:"Logro sistemático de las metas establecidas para su área." },
  { id:"p1", category:"planning",      label:"Gestión de recursos",             desc:"Optimización del tiempo y el presupuesto asignado." },
  { id:"s1", category:"soft-skills",   label:"Gestión emocional",               desc:"Maneja adecuadamente las emociones y mantiene el control ante situaciones de presión." },
  { id:"s2", category:"soft-skills",   label:"Proactividad",                    desc:"Iniciativa para anticiparse a problemas y proponer soluciones sin supervisión constante." },
  { id:"s3", category:"soft-skills",   label:"Adaptabilidad y Resiliencia",     desc:"Capacidad para ajustarse a cambios y recuperarse ante contratiempos de forma constructiva." },
  { id:"s4", category:"soft-skills",   label:"Trabajo en equipo",               desc:"Fomenta un ambiente de cooperación y contribuye activamente al éxito del grupo." },
];

const SCALE = [
  { v:1, label:"Insuficiente", color:"#ef4444" },
  { v:2, label:"Regular",      color:"#f97316" },
  { v:3, label:"Aceptable",    color:"#eab308" },
  { v:4, label:"Destacado",    color:"#22c55e" },
  { v:5, label:"Sobresaliente",color:"#CC785C" },
];

function scoreColor(s) {
  if (s >= 4.5) return "#CC785C";
  if (s >= 3.5) return "#22c55e";
  if (s >= 2.5) return "#eab308";
  return "#ef4444";
}
function scoreLabel(s) {
  if (s >= 4.5) return "Sobresaliente";
  if (s >= 3.5) return "Destacado";
  if (s >= 2.5) return "Aceptable";
  return "A mejorar";
}

// ── PERSISTENCE HOOK ────────────────────────────────────────────────────────
function useLS(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [val, key]);
  return [val, setVal];
}

// ── MINI CHART ───────────────────────────────────────────────────────────────
function MiniBar({ value, max = 5, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ background:"#E8E3DC", borderRadius:3, height:6, width:"100%", overflow:"hidden" }}>
      <div style={{ width:`${pct}%`, height:"100%", background: color, borderRadius:3,
        transition:"width 0.7s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function SpiderChart({ scores, criteria, categories }) {
  const cats = categories.filter(c => criteria.some(cr => cr.category === c.id));
  const n = cats.length;
  if (n < 3) return null;
  const cx = 110, cy = 110, r = 80;
  const pts = (val) => cats.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const rv = (val / 5) * r;
    return [cx + rv * Math.cos(angle), cy + rv * Math.sin(angle)];
  });
  const gridPts = (frac) => cats.map((_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + frac * r * Math.cos(angle), cy + frac * r * Math.sin(angle)];
  });
  const catScores = cats.map(cat => {
    const crs = criteria.filter(cr => cr.category === cat.id);
    if (!crs.length) return 0;
    const total = crs.reduce((a, cr) => a + (scores?.[cr.id] || 0), 0);
    return total / crs.length;
  });
  const valuePts = cats.map((cat, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const rv = (catScores[i] / 5) * r;
    return [cx + rv * Math.cos(angle), cy + rv * Math.sin(angle)];
  });
  const poly = (pts) => pts.map(p => p.join(",")).join(" ");

  return (
    <svg viewBox="0 0 220 220" style={{ width:"100%", maxWidth:220 }}>
      {[0.2,0.4,0.6,0.8,1].map(f => (
        <polygon key={f} points={poly(gridPts(f))} fill="none" stroke="#B5AFA8" strokeWidth="0.8" />
      ))}
      {cats.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#B5AFA8" strokeWidth="0.8" />;
      })}
      <polygon points={poly(valuePts)} fill="rgba(204,120,92,0.2)" stroke="#CC785C" strokeWidth="2" />
      {cats.map((cat, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const lx = cx + (r + 18) * Math.cos(angle);
        const ly = cy + (r + 18) * Math.sin(angle);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize:7, fill:"#7A746E", fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>
            {cat.name.substring(0,8)}
          </text>
        );
      })}
    </svg>
  );
}

// ── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div style={{
      background:"#F5F3EF", border:`1px solid #E8E3DC`,
      borderRadius:16, padding:"24px 28px",
      borderTop:`3px solid ${accent}`,
      display:"flex", flexDirection:"column", gap:12
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#9E9890", letterSpacing:"0.12em", textTransform:"uppercase" }}>{label}</span>
        <span style={{ color: accent, opacity:0.9 }}>{icon}</span>
      </div>
      <div style={{ fontSize:44, fontWeight:900, color:"#1A1714", letterSpacing:"-2px", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, color:"#9E9890", fontWeight:600 }}>{sub}</div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]           = useState("dashboard");
  const [cats, setCats]           = useLS("ep_cats", INIT_CATS);
  const [criteria, setCriteria]   = useLS("ep_criteria", INIT_CRITERIA);
  const [evals, setEvals]         = useLS("ep_evals", []);
  const [notifs, setNotifs]       = useLS("ep_notifs", [
    { id:"n1", title:"Sistema iniciado",       msg:"EvaluaPro listo para gestión de desempeño.", read:false, type:"info",    date: new Date().toISOString() },
    { id:"n2", title:"Evaluaciones Q2",        msg:"Recuerda completar las evaluaciones del trimestre.", read:false, type:"alert",   date: new Date(Date.now()-86400000).toISOString() },
  ]);
  const [selEvalId, setSelEvalId] = useState(null);
  const [showNotifs, setShowNotifs]= useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [search, setSearch]       = useState("");
  const [settingsTab, setSettingsTab] = useState("categories");
  const [importMsg, setImportMsg] = useState(null);

  const unread = notifs.filter(n => !n.read).length;

  const addEval = (ev) => {
    setEvals([ev, ...evals]);
    setNotifs([{
      id: crypto.randomUUID(), title:"Nueva evaluación registrada",
      msg:`${ev.candidateName} — Puntaje: ${ev.overallScore.toFixed(1)}`,
      read:false, type:"success", date: new Date().toISOString()
    }, ...notifs]);
    setView("dashboard");
  };

  const deleteEval = (id) => {
    if (confirm("¿Eliminar esta evaluación?")) setEvals(evals.filter(e => e.id !== id));
  };

  // ── EXPORT ──────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const payload = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      exportedBy: "EvaluaPro · Fares Taie",
      evaluations: evals,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `evaluaciones_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotifs(n => [{ id: crypto.randomUUID(), title:"Exportación completada",
      msg:`${evals.length} evaluaciones exportadas correctamente.`,
      read:false, type:"success", date: new Date().toISOString() }, ...n]);
  };

  // ── IMPORT ──────────────────────────────────────────────────────────────────
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.evaluations || !Array.isArray(data.evaluations)) {
          setImportMsg({ type:"error", text:"Archivo inválido: no contiene evaluaciones." });
          return;
        }
        // Merge: avoid duplicate IDs
        const existingIds = new Set(evals.map(e => e.id));
        const newOnes = data.evaluations.filter(e => !existingIds.has(e.id));
        const dupes   = data.evaluations.length - newOnes.length;
        setEvals(prev => [...newOnes, ...prev]);
        setImportMsg({
          type:"success",
          text:`✓ ${newOnes.length} evaluaciones importadas.${dupes > 0 ? ` ${dupes} duplicadas omitidas.` : ""}`
        });
        setNotifs(n => [{ id: crypto.randomUUID(), title:"Importación completada",
          msg:`${newOnes.length} evaluaciones nuevas incorporadas al registro.`,
          read:false, type:"success", date: new Date().toISOString() }, ...n]);
        setTimeout(() => setImportMsg(null), 4000);
      } catch {
        setImportMsg({ type:"error", text:"Error al leer el archivo. Verificá que sea un JSON válido de EvaluaPro." });
        setTimeout(() => setImportMsg(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const stats = useMemo(() => {
    const t = evals.length;
    if (!t) return { avg:0, total:0, top:0 };
    const avg = evals.reduce((a,e) => a + e.overallScore, 0) / t;
    return { avg: avg.toFixed(1), total: t, top: evals.filter(e => e.overallScore >= 4.5).length };
  }, [evals]);

  const selEval = evals.find(e => e.id === selEvalId);

  return (
    <div style={{
      display:"flex", height:"100vh", background:"#FAF9F7",
      fontFamily:"'Inter', 'Segoe UI', system-ui, sans-serif", color:"#1A1714",
      overflow:"hidden"
    }}>
      {/* Sidebar */}
      <aside style={{
        width:240, background:"#FFFFFF", borderRight:"1px solid #E8E3DC",
        display:"flex", flexDirection:"column", flexShrink:0, overflowY:"auto"
      }}>
        {/* Logo */}
        <div style={{ padding:"28px 24px 20px", borderBottom:"1px solid #E8E3DC" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:34, height:34, background:"linear-gradient(135deg,#CC785C,#D4956B)",
              borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, fontWeight:900
            }}>FT</div>
            <div>
              <div style={{ fontSize:14, fontWeight:800, letterSpacing:"-0.5px" }}>EvaluaPro</div>
              <div style={{ fontSize:10, color:"#9E9890", fontWeight:600 }}>Fares Taie · RRHH</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding:"16px 12px", flex:1 }}>
          {[
            { id:"dashboard", label:"Tablero", icon:<IcoDash /> },
            { id:"evaluate",  label:"Nueva evaluación", icon:<IcoPlus /> },
            { id:"settings",  label:"Configuración", icon:<IcoSettings /> },
          ].map(item => (
            <button key={item.id} onClick={() => { setView(item.id); setSelEvalId(null); }}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"10px 14px", borderRadius:10, border:"none", cursor:"pointer",
                marginBottom:4, textAlign:"left", fontSize:13, fontWeight:600,
                background: view === item.id && !selEvalId ? "rgba(204,120,92,0.12)" : "transparent",
                color: view === item.id && !selEvalId ? "#CC785C" : "#8C867F",
                transition:"all .15s"
              }}>
              <span style={{ color: view === item.id && !selEvalId ? "#CC785C" : "#B5AFA8" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          
          {/* Categories list */}
          <div style={{ marginTop:24, paddingLeft:14 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#B5AFA8", letterSpacing:"0.1em",
              textTransform:"uppercase", marginBottom:10 }}>Competencias</div>
            {cats.map(cat => (
              <div key={cat.id} style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"6px 0", fontSize:11, color:"#9E9890", fontWeight:600
              }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:cat.color, flexShrink:0 }} />
                {cat.name}
              </div>
            ))}
          </div>

          {/* Transfer panel */}
          <div style={{ marginTop:28, paddingLeft:0 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#B5AFA8", letterSpacing:"0.1em",
              textTransform:"uppercase", marginBottom:10, paddingLeft:14 }}>Transferencia</div>
            <button onClick={handleExport} disabled={evals.length === 0}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"10px 14px", borderRadius:10, border:"none", cursor:"pointer",
                marginBottom:4, textAlign:"left", fontSize:13, fontWeight:600,
                background:"transparent", color:"#8C867F", transition:"all .15s",
                opacity: evals.length === 0 ? 0.4 : 1
              }}>
              <span style={{ color:"#B5AFA8" }}><IcoExport /></span>
              Exportar datos
            </button>
            <label style={{
              width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"10px 14px", borderRadius:10, cursor:"pointer",
              marginBottom:4, fontSize:13, fontWeight:600,
              color:"#8C867F", transition:"all .15s"
            }}>
              <span style={{ color:"#B5AFA8" }}><IcoImport /></span>
              Importar datos
              <input type="file" accept=".json" onChange={handleImport}
                style={{ display:"none" }} />
            </label>
          </div>
        </nav>

        {/* User */}
        <div style={{ padding:"16px 20px", borderTop:"1px solid #E8E3DC" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:32, height:32, borderRadius:8, background:"#E8E3DC",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:900, color:"#CC785C"
            }}>JR</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700 }}>Jefatura RRHH</div>
              <div style={{ fontSize:10, color:"#9E9890" }}>Sesión activa</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <header style={{
          height:64, background:"#FFFFFF", borderBottom:"1px solid #E8E3DC",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 32px", flexShrink:0, gap:16
        }}>
          <div>
            <div style={{ fontSize:11, color:"#9E9890", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>
              {selEvalId ? "Detalle de evaluación" : view === "dashboard" ? "Resumen de desempeño" : view === "evaluate" ? "Nueva evaluación" : "Configuración"}
            </div>
            <div style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.5px", marginTop:2 }}>
              {selEvalId ? selEval?.candidateName : view === "dashboard" ? "Tablero de Control" : view === "evaluate" ? "Formulario de Evaluación" : "Parámetros del Sistema"}
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Search */}
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#B5AFA8" }}>
                <IcoSearch />
              </span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar colaborador..."
                style={{
                  background:"#F5F3EF", border:"1px solid #E8E3DC", borderRadius:10,
                  padding:"8px 14px 8px 38px", fontSize:12, color:"#1A1714",
                  outline:"none", width:220, fontFamily:"inherit"
                }} />
            </div>

            {/* Notifs */}
            <div style={{ position:"relative" }}>
              <button onClick={() => setShowNotifs(!showNotifs)} style={{
                width:38, height:38, borderRadius:10, background: showNotifs ? "#CC785C" : "#F5F3EF",
                border:"1px solid #E8E3DC", cursor:"pointer", color:"#1A1714",
                display:"flex", alignItems:"center", justifyContent:"center", position:"relative"
              }}>
                <IcoBell />
                {unread > 0 && (
                  <span style={{
                    position:"absolute", top:-4, right:-4, width:16, height:16,
                    background:"#ef4444", borderRadius:"50%", fontSize:9, fontWeight:900,
                    display:"flex", alignItems:"center", justifyContent:"center", color:"#fff",
                    border:"2px solid #FAF9F7"
                  }}>{unread}</span>
                )}
              </button>

              {showNotifs && (
                <div style={{
                  position:"absolute", right:0, top:46, width:340,
                  background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16,
                  boxShadow:"0 24px 48px rgba(0,0,0,0.6)", zIndex:100, overflow:"hidden"
                }}>
                  <div style={{ padding:"16px 20px", borderBottom:"1px solid #E8E3DC",
                    display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:700 }}>Notificaciones</span>
                    <button onClick={() => setNotifs(notifs.map(n=>({...n,read:true})))}
                      style={{ fontSize:11, color:"#CC785C", background:"none", border:"none",
                        cursor:"pointer", fontWeight:700 }}>Marcar todo leído</button>
                  </div>
                  <div style={{ maxHeight:320, overflowY:"auto" }}>
                    {notifs.map(n => (
                      <div key={n.id} style={{
                        padding:"14px 20px", borderBottom:"1px solid #E8E3DC",
                        background: n.read ? "transparent" : "rgba(204,120,92,0.06)",
                        display:"flex", gap:12, alignItems:"flex-start"
                      }}>
                        <div style={{
                          width:8, height:8, borderRadius:"50%", marginTop:4, flexShrink:0,
                          background: n.type==="success" ? "#22c55e" : n.type==="alert" ? "#f59e0b" : "#CC785C"
                        }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:700 }}>{n.title}</div>
                          <div style={{ fontSize:11, color:"#8C867F", marginTop:2 }}>{n.msg}</div>
                        </div>
                        <button onClick={() => setNotifs(notifs.filter(x=>x.id!==n.id))}
                          style={{ color:"#B5AFA8", background:"none", border:"none", cursor:"pointer", flexShrink:0 }}>
                          <IcoX />
                        </button>
                      </div>
                    ))}
                    {notifs.length === 0 && (
                      <div style={{ padding:32, textAlign:"center", color:"#B5AFA8", fontSize:12 }}>
                        Sin notificaciones
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:32 }}
          onClick={() => showNotifs && setShowNotifs(false)}>

          {/* Import feedback toast */}
          {importMsg && (
            <div style={{
              position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
              background: importMsg.type === "success" ? "#1a3a2a" : "#3a1a1a",
              border: `1px solid ${importMsg.type === "success" ? "#22c55e44" : "#ef444444"}`,
              color: importMsg.type === "success" ? "#4ade80" : "#f87171",
              padding:"12px 24px", borderRadius:12, fontSize:13, fontWeight:600,
              zIndex:999, boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
              display:"flex", alignItems:"center", gap:10
            }}>
              {importMsg.text}
            </div>
          )}
          {selEvalId
            ? <DetailView eval={selEval} criteria={criteria} cats={cats}
                onBack={() => setSelEvalId(null)} />
            : view === "dashboard"
            ? <DashboardView evals={evals} stats={stats} criteria={criteria} cats={cats}
                search={search} onDelete={deleteEval} onView={id => setSelEvalId(id)} />
            : view === "evaluate"
            ? <EvaluateView cats={cats} criteria={criteria} onSubmit={addEval}
                onCancel={() => setView("dashboard")} />
            : <SettingsView cats={cats} setCats={setCats} criteria={criteria}
                setCriteria={setCriteria} tab={settingsTab} setTab={setSettingsTab} />
          }
        </div>
      </main>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({ evals, stats, criteria, cats, search, onDelete, onView }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");
  const [expanded, setExpanded]   = useState(null);

  const filtered = useMemo(() => evals.filter(ev => {
    const d = new Date(ev.date).getTime();
    const s = startDate ? new Date(startDate).getTime() : -Infinity;
    const e = endDate ? new Date(endDate).setHours(23,59,59,999) : Infinity;
    const q = search.toLowerCase();
    return d >= s && d <= e &&
      (!q || ev.candidateName.toLowerCase().includes(q) || ev.candidateRole.toLowerCase().includes(q));
  }), [evals, startDate, endDate, search]);

  const fStats = useMemo(() => {
    const t = filtered.length;
    if (!t) return { avg:0, total:0, top:0 };
    const avg = filtered.reduce((a,e) => a + e.overallScore, 0) / t;
    return { avg: avg.toFixed(1), total:t, top: filtered.filter(e => e.overallScore >= 4.5).length };
  }, [filtered]);

  // Simple sparkline
  const chartData = useMemo(() => {
    const map = {};
    filtered.forEach(ev => {
      const dk = new Date(ev.date).toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit" });
      if (!map[dk]) map[dk] = { total:0, count:0, ts: new Date(ev.date).getTime() };
      map[dk].total += ev.overallScore;
      map[dk].count++;
    });
    return Object.entries(map).map(([k,v]) => ({ label:k, score: +(v.total/v.count).toFixed(2), ts:v.ts }))
      .sort((a,b) => a.ts - b.ts);
  }, [filtered]);

  const W = 600, H = 100, pad = 10;
  const maxS = 5, minS = 0;
  const cx = (i) => chartData.length < 2 ? W/2 : pad + (i/(chartData.length-1))*(W-pad*2);
  const cy = (s) => H - pad - ((s - minS)/(maxS - minS))*(H - pad*2);
  const pathD = chartData.map((d,i) => `${i===0?"M":"L"} ${cx(i)} ${cy(d.score)}`).join(" ");
  const areaD = chartData.length > 0
    ? `${pathD} L ${cx(chartData.length-1)} ${H-pad} L ${cx(0)} ${H-pad} Z`
    : "";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        <StatCard label="Puntaje promedio" value={fStats.avg || "—"} sub="Sobre evaluaciones filtradas"
          icon={<IcoTrend />} accent="#CC785C" />
        <StatCard label="Total evaluados" value={fStats.total} sub="Registros en el período"
          icon={<IcoUsers />} accent="#8B9EB7" />
        <StatCard label="Sobresalientes" value={fStats.top} sub="Puntaje ≥ 4.5"
          icon={<IcoAward />} accent="#10b981" />
      </div>

      {/* Filters */}
      <div style={{
        background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16,
        padding:"20px 24px", display:"flex", gap:16, flexWrap:"wrap", alignItems:"flex-end"
      }}>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <label style={{ fontSize:10, fontWeight:700, color:"#9E9890", letterSpacing:"0.1em", textTransform:"uppercase" }}>Desde</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ background:"#F5F3EF", border:"1px solid #E8E3DC", borderRadius:8,
              padding:"8px 12px", color:"#1A1714", fontSize:12, fontFamily:"inherit", outline:"none" }} />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <label style={{ fontSize:10, fontWeight:700, color:"#9E9890", letterSpacing:"0.1em", textTransform:"uppercase" }}>Hasta</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            style={{ background:"#F5F3EF", border:"1px solid #E8E3DC", borderRadius:8,
              padding:"8px 12px", color:"#1A1714", fontSize:12, fontFamily:"inherit", outline:"none" }} />
        </div>
        <button onClick={() => { setStartDate(""); setEndDate(""); }}
          disabled={!startDate && !endDate}
          style={{ padding:"9px 18px", background:"transparent", border:"1px solid #E8E3DC",
            borderRadius:8, color:"#8C867F", fontSize:12, fontWeight:600, cursor:"pointer",
            opacity: (!startDate && !endDate) ? 0.4 : 1 }}>
          Limpiar
        </button>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:12, color:"#9E9890" }}>{filtered.length} resultados</span>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, padding:"24px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#9E9890", marginBottom:16, letterSpacing:"0.08em", textTransform:"uppercase" }}>
            Tendencia de desempeño
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:100 }}>
            <defs>
              <linearGradient id="grd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CC785C" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#CC785C" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[1,2,3,4,5].map(v => (
              <line key={v} x1={pad} y1={cy(v)} x2={W-pad} y2={cy(v)}
                stroke="#E8E3DC" strokeWidth="1" />
            ))}
            {areaD && <path d={areaD} fill="url(#grd)" />}
            {pathD && <path d={pathD} fill="none" stroke="#CC785C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
            {chartData.map((d,i) => (
              <circle key={i} cx={cx(i)} cy={cy(d.score)} r="4" fill="#CC785C" stroke="#FFFFFF" strokeWidth="2" />
            ))}
          </svg>
        </div>
      )}

      {/* Table */}
      <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, overflow:"hidden" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #E8E3DC",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:14, fontWeight:700 }}>Archivo histórico</div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding:48, textAlign:"center", color:"#B5AFA8", fontSize:13 }}>
            Sin evaluaciones registradas.
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#F5F3EF" }}>
                {["Colaborador", "Índice", "Evaluador", "Fecha", "Acciones"].map(h => (
                  <th key={h} style={{ padding:"12px 20px", textAlign:"left", fontSize:10,
                    fontWeight:700, color:"#9E9890", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => (
                <>
                  <tr key={ev.id} style={{
                    borderTop:"1px solid #E8E3DC",
                    background: expanded === ev.id ? "#F5F3EF" : "transparent",
                    cursor:"pointer", transition:"background .15s"
                  }} onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}>
                    <td style={{ padding:"16px 20px" }}>
                      <div style={{ fontSize:13, fontWeight:700 }}>{ev.candidateName}</div>
                      <div style={{ fontSize:11, color:"#8C867F", marginTop:2 }}>{ev.candidateRole}</div>
                    </td>
                    <td style={{ padding:"16px 20px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <span style={{
                          fontSize:20, fontWeight:900, color: scoreColor(ev.overallScore),
                          letterSpacing:"-1px"
                        }}>{ev.overallScore.toFixed(1)}</span>
                        <div style={{ flex:1, minWidth:80 }}>
                          <MiniBar value={ev.overallScore} color={scoreColor(ev.overallScore)} />
                          <div style={{ fontSize:10, color:"#9E9890", marginTop:3 }}>{scoreLabel(ev.overallScore)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"16px 20px", fontSize:12, color:"#7A746E" }}>{ev.evaluatorName}</td>
                    <td style={{ padding:"16px 20px", fontSize:12, color:"#8C867F" }}>
                      {new Date(ev.date).toLocaleDateString("es-AR")}
                    </td>
                    <td style={{ padding:"16px 20px" }}>
                      <div style={{ display:"flex", gap:8 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => onView(ev.id)} title="Ver detalle"
                          style={{ width:32, height:32, borderRadius:8, background:"#E8E3DC",
                            border:"none", cursor:"pointer", color:"#CC785C",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <IcoFile />
                        </button>
                        <button onClick={() => onDelete(ev.id)} title="Eliminar"
                          style={{ width:32, height:32, borderRadius:8, background:"#E8E3DC",
                            border:"none", cursor:"pointer", color:"#f87171",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <IcoTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === ev.id && (
                    <tr key={ev.id+"exp"} style={{ borderTop:"1px solid #E8E3DC" }}>
                      <td colSpan={5} style={{ padding:"20px 24px", background:"#F0EDE8" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
                          {criteria.map(cr => (
                            <div key={cr.id} style={{ background:"#FFFFFF", borderRadius:10, padding:"12px 16px" }}>
                              <div style={{ fontSize:11, fontWeight:700, marginBottom:6, color:"#2D2926" }}>{cr.label}</div>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <MiniBar value={ev.scores?.[cr.id] || 0} color={scoreColor(ev.scores?.[cr.id] || 0)} />
                                <span style={{ fontSize:13, fontWeight:800, color: scoreColor(ev.scores?.[cr.id]||0), minWidth:24 }}>
                                  {ev.scores?.[cr.id] || "—"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {ev.comments && (
                          <div style={{ marginTop:16, padding:"12px 16px", background:"#FFFFFF",
                            borderRadius:10, fontSize:12, color:"#7A746E", fontStyle:"italic",
                            borderLeft:"3px solid #CC785C" }}>
                            {ev.comments}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── EVALUATE ─────────────────────────────────────────────────────────────────
function EvaluateView({ cats, criteria, onSubmit, onCancel }) {
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState({ candidateName:"", candidateRole:"", evaluatorName:"", scores:{}, comments:"" });

  const valid1 = form.candidateName && form.candidateRole && form.evaluatorName;
  const scored = criteria.filter(c => form.scores[c.id]).length;
  const valid2 = scored === criteria.length;

  const submit = () => {
    const vals = Object.values(form.scores);
    const overall = vals.length ? vals.reduce((a,b) => a+b, 0) / vals.length : 0;
    onSubmit({ id: crypto.randomUUID(), ...form, date: new Date().toISOString(), overallScore: +overall.toFixed(2) });
  };

  const steps = ["Identificación", "Competencias", "Revisión"];

  return (
    <div style={{ maxWidth:760, margin:"0 auto" }}>
      {/* Progress */}
      <div style={{ display:"flex", gap:0, marginBottom:32, background:"#FFFFFF",
        border:"1px solid #E8E3DC", borderRadius:12, overflow:"hidden" }}>
        {steps.map((s,i) => (
          <div key={i} style={{
            flex:1, padding:"14px 20px", textAlign:"center",
            background: step === i ? "#CC785C" : step > i ? "rgba(204,120,92,0.12)" : "transparent",
            borderRight: i < steps.length-1 ? "1px solid #E8E3DC" : "none",
            transition:"background .2s"
          }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
              color: step === i ? "#fff" : step > i ? "#CC785C" : "#B5AFA8" }}>
              {String(i+1).padStart(2,"0")}. {s}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, overflow:"hidden" }}>
        <div style={{ padding:32 }}>
          {/* Step 0 */}
          {step === 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              <h3 style={{ fontSize:24, fontWeight:900, letterSpacing:"-1px", margin:0 }}>Datos del evaluado</h3>
              <Field label="Nombre completo" value={form.candidateName}
                onChange={v => setForm({...form, candidateName:v})} placeholder="Ej: María González" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <Field label="Cargo / Área" value={form.candidateRole}
                  onChange={v => setForm({...form, candidateRole:v})} placeholder="Ej: Jefa de Logística" />
                <Field label="Evaluador responsable" value={form.evaluatorName}
                  onChange={v => setForm({...form, evaluatorName:v})} placeholder="Ej: Damián Basuza" />
              </div>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <h3 style={{ fontSize:24, fontWeight:900, letterSpacing:"-1px", margin:0 }}>Calificación por competencias</h3>
                <div style={{ fontSize:12, fontWeight:700, color: valid2 ? "#22c55e" : "#CC785C" }}>
                  {scored}/{criteria.length} completados
                </div>
              </div>
              {/* Scale legend */}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {SCALE.map(s => (
                  <div key={s.v} style={{ display:"flex", alignItems:"center", gap:6,
                    background:"#F5F3EF", borderRadius:8, padding:"4px 10px" }}>
                    <span style={{ width:18, height:18, borderRadius:5, background:s.color,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, fontWeight:900, color:"#FAF9F7" }}>{s.v}</span>
                    <span style={{ fontSize:10, fontWeight:600, color:"#8C867F" }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {cats.map(cat => {
                const catCrit = criteria.filter(c => c.category === cat.id);
                if (!catCrit.length) return null;
                return (
                  <div key={cat.id}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:cat.color }} />
                      <span style={{ fontSize:13, fontWeight:700, color:"#2D2926" }}>{cat.name}</span>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      {catCrit.map(cr => (
                        <div key={cr.id} style={{
                          background:"#F5F3EF", borderRadius:12, padding:"16px 20px",
                          borderLeft:`3px solid ${form.scores[cr.id] ? scoreColor(form.scores[cr.id]) : "#E8E3DC"}`
                        }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>{cr.label}</div>
                              <div style={{ fontSize:11, color:"#8C867F" }}>{cr.desc}</div>
                            </div>
                            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                              {[1,2,3,4,5].map(v => (
                                <button key={v} onClick={() => setForm({...form, scores:{...form.scores,[cr.id]:v}})}
                                  style={{
                                    width:34, height:34, borderRadius:8, border:"none",
                                    fontWeight:900, fontSize:13, cursor:"pointer",
                                    transition:"all .15s",
                                    background: form.scores[cr.id] === v ? scoreColor(v) : "#E8E3DC",
                                    color: form.scores[cr.id] === v ? "#FAF9F7" : "#9E9890",
                                    transform: form.scores[cr.id] === v ? "scale(1.15)" : "scale(1)"
                                  }}>{v}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
              <h3 style={{ fontSize:24, fontWeight:900, letterSpacing:"-1px", margin:0 }}>Revisión final</h3>
              <div style={{ background:"#F5F3EF", borderRadius:12, padding:"20px 24px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <InfoItem label="Evaluado" value={form.candidateName} />
                  <InfoItem label="Cargo" value={form.candidateRole} />
                  <InfoItem label="Evaluador" value={form.evaluatorName} />
                  <InfoItem label="Competencias" value={`${scored}/${criteria.length} calificadas`} />
                </div>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"#9E9890",
                  letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:8 }}>
                  Observaciones (opcional)
                </label>
                <textarea value={form.comments} onChange={e => setForm({...form, comments:e.target.value})}
                  rows={4} placeholder="Comentarios adicionales sobre el desempeño..."
                  style={{
                    width:"100%", background:"#F5F3EF", border:"1px solid #E8E3DC",
                    borderRadius:10, padding:"12px 16px", color:"#1A1714", fontSize:13,
                    fontFamily:"inherit", resize:"vertical", outline:"none", boxSizing:"border-box"
                  }} />
              </div>
              <div style={{ background:"rgba(204,120,92,0.1)", border:"1px solid rgba(204,120,92,0.3)",
                borderRadius:12, padding:"16px 20px" }}>
                <div style={{ fontSize:12, color:"#CC785C", marginBottom:4 }}>Puntaje estimado</div>
                <div style={{ fontSize:36, fontWeight:900, color:"#CC785C" }}>
                  {criteria.length > 0
                    ? (Object.values(form.scores).reduce((a,b)=>a+b,0)/criteria.length).toFixed(1)
                    : "—"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding:"20px 32px", borderTop:"1px solid #E8E3DC",
          display:"flex", justifyContent:"space-between" }}>
          <button onClick={step === 0 ? onCancel : () => setStep(s => s-1)}
            style={{ padding:"10px 24px", background:"transparent", border:"1px solid #E8E3DC",
              borderRadius:10, color:"#8C867F", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            {step === 0 ? "Cancelar" : "Anterior"}
          </button>
          {step < 2
            ? <button onClick={() => setStep(s => s+1)}
                disabled={step===0 ? !valid1 : !valid2}
                style={{ padding:"10px 28px", background:"#CC785C", border:"none", borderRadius:10,
                  color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
                  display:"flex", alignItems:"center", gap:8,
                  opacity: (step===0 ? !valid1 : !valid2) ? 0.4 : 1 }}>
                Continuar <IcoArrow />
              </button>
            : <button onClick={submit}
                style={{ padding:"10px 28px", background:"#22c55e", border:"none", borderRadius:10,
                  color:"#FAF9F7", fontSize:13, fontWeight:800, cursor:"pointer",
                  display:"flex", alignItems:"center", gap:8 }}>
                <IcoCheck /> Guardar evaluación
              </button>
          }
        </div>
      </div>
    </div>
  );
}

// ── DETAIL VIEW ───────────────────────────────────────────────────────────────
function DetailView({ eval: ev, criteria, cats, onBack }) {
  if (!ev) return null;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, maxWidth:900 }}>
      <button onClick={onBack} style={{
        display:"flex", alignItems:"center", gap:8, background:"none", border:"none",
        color:"#CC785C", fontSize:13, fontWeight:700, cursor:"pointer", padding:0,
        alignSelf:"flex-start"
      }}>← Volver al tablero</button>

      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20 }}>
        {/* Left */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, padding:24 }}>
            <div style={{ width:56, height:56, borderRadius:14,
              background:`linear-gradient(135deg,${scoreColor(ev.overallScore)}33,${scoreColor(ev.overallScore)}11)`,
              border:`2px solid ${scoreColor(ev.overallScore)}55`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, marginBottom:16 }}>
              <IcoUsers />
            </div>
            <div style={{ fontSize:20, fontWeight:900, marginBottom:4 }}>{ev.candidateName}</div>
            <div style={{ fontSize:12, color: scoreColor(ev.overallScore), fontWeight:600, marginBottom:16 }}>{ev.candidateRole}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <InfoItem label="Evaluador" value={ev.evaluatorName} />
              <InfoItem label="Fecha" value={new Date(ev.date).toLocaleDateString("es-AR")} />
            </div>
          </div>

          <div style={{ background:"#FFFFFF", border:`1px solid ${scoreColor(ev.overallScore)}44`,
            borderRadius:16, padding:24, textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#9E9890", fontWeight:700, marginBottom:8,
              letterSpacing:"0.1em", textTransform:"uppercase" }}>Índice global</div>
            <div style={{ fontSize:56, fontWeight:900, color: scoreColor(ev.overallScore),
              letterSpacing:"-3px" }}>{ev.overallScore.toFixed(1)}</div>
            <div style={{ fontSize:12, color:"#9E9890", marginTop:4 }}>{scoreLabel(ev.overallScore)}</div>
          </div>

          <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, padding:24 }}>
            <div style={{ fontSize:11, color:"#9E9890", fontWeight:700, marginBottom:12,
              letterSpacing:"0.1em", textTransform:"uppercase" }}>Radar por área</div>
            <SpiderChart scores={ev.scores} criteria={criteria} categories={cats} />
          </div>
        </div>

        {/* Right */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:20 }}>Desglose de competencias</div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {cats.map(cat => {
                const crs = criteria.filter(c => c.category === cat.id);
                if (!crs.length) return null;
                return (
                  <div key={cat.id}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:cat.color }} />
                      <span style={{ fontSize:11, fontWeight:700, color:"#7A746E",
                        textTransform:"uppercase", letterSpacing:"0.08em" }}>{cat.name}</span>
                    </div>
                    {crs.map(cr => {
                      const s = ev.scores?.[cr.id] || 0;
                      return (
                        <div key={cr.id} style={{ marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                            <span style={{ fontSize:12, fontWeight:600, color:"#4A4540" }}>{cr.label}</span>
                            <span style={{ fontSize:13, fontWeight:800, color: scoreColor(s) }}>{s || "—"}</span>
                          </div>
                          <MiniBar value={s} color={scoreColor(s)} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {ev.comments && (
            <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, padding:24 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>Observaciones</div>
              <p style={{ fontSize:13, color:"#7A746E", lineHeight:1.6, fontStyle:"italic" }}>{ev.comments}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsView({ cats, setCats, criteria, setCriteria, tab, setTab }) {
  const [newCat, setNewCat]   = useState({ name:"", color:"#CC785C" });
  const [newCrit, setNewCrit] = useState({ category:"", label:"", desc:"" });
  const [editCat, setEditCat] = useState(null);

  const addCategory = () => {
    if (!newCat.name.trim()) return;
    setCats([...cats, { id: crypto.randomUUID(), ...newCat }]);
    setNewCat({ name:"", color:"#CC785C" });
  };
  const deleteCategory = (id) => {
    setCats(cats.filter(c => c.id !== id));
    setCriteria(criteria.filter(cr => cr.category !== id));
  };
  const addCriterion = () => {
    if (!newCrit.label.trim() || !newCrit.category) return;
    setCriteria([...criteria, { id: crypto.randomUUID(), ...newCrit }]);
    setNewCrit({ category:"", label:"", desc:"" });
  };
  const deleteCriterion = (id) => setCriteria(criteria.filter(c => c.id !== id));

  return (
    <div style={{ maxWidth:760 }}>
      <div style={{ display:"flex", gap:0, background:"#FFFFFF", border:"1px solid #E8E3DC",
        borderRadius:12, overflow:"hidden", marginBottom:24 }}>
        {[["categories","Categorías"], ["criteria","Competencias"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:"12px 20px", border:"none", cursor:"pointer",
            fontSize:13, fontWeight:700, transition:"all .15s",
            background: tab === t ? "#CC785C" : "transparent",
            color: tab === t ? "#fff" : "#9E9890"
          }}>{l}</button>
        ))}
      </div>

      {tab === "categories" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Nueva categoría</div>
            <div style={{ display:"flex", gap:12, alignItems:"flex-end" }}>
              <div style={{ flex:1 }}>
                <Field label="Nombre" value={newCat.name} onChange={v => setNewCat({...newCat, name:v})}
                  placeholder="Ej: Innovación" />
              </div>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:"#9E9890", display:"block",
                  marginBottom:6, letterSpacing:"0.1em", textTransform:"uppercase" }}>Color</label>
                <input type="color" value={newCat.color} onChange={e => setNewCat({...newCat, color:e.target.value})}
                  style={{ width:44, height:38, borderRadius:8, border:"1px solid #E8E3DC",
                    background:"#F5F3EF", cursor:"pointer" }} />
              </div>
              <button onClick={addCategory} style={{
                padding:"9px 20px", background:"#CC785C", border:"none", borderRadius:10,
                color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex",
                alignItems:"center", gap:6 }}>
                <IcoPlus /> Agregar
              </button>
            </div>
          </div>

          <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, overflow:"hidden" }}>
            {cats.map((cat, i) => (
              <div key={cat.id} style={{
                padding:"16px 24px", borderBottom: i < cats.length-1 ? "1px solid #E8E3DC" : "none",
                display:"flex", alignItems:"center", gap:12
              }}>
                <div style={{ width:12, height:12, borderRadius:"50%", background:cat.color }} />
                <span style={{ flex:1, fontSize:13, fontWeight:600 }}>{cat.name}</span>
                <span style={{ fontSize:11, color:"#B5AFA8" }}>
                  {criteria.filter(c => c.category === cat.id).length} competencias
                </span>
                <button onClick={() => deleteCategory(cat.id)} style={{
                  width:32, height:32, borderRadius:8, background:"#E8E3DC", border:"none",
                  cursor:"pointer", color:"#f87171", display:"flex", alignItems:"center",
                  justifyContent:"center" }}>
                  <IcoTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "criteria" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#FFFFFF", border:"1px solid #E8E3DC", borderRadius:16, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Nueva competencia</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div>
                <label style={{ fontSize:10, fontWeight:700, color:"#9E9890", display:"block",
                  marginBottom:6, letterSpacing:"0.1em", textTransform:"uppercase" }}>Categoría</label>
                <select value={newCrit.category} onChange={e => setNewCrit({...newCrit, category:e.target.value})}
                  style={{ width:"100%", background:"#F5F3EF", border:"1px solid #E8E3DC",
                    borderRadius:10, padding:"10px 14px", color:"#1A1714", fontSize:13,
                    fontFamily:"inherit", outline:"none" }}>
                  <option value="">Seleccionar categoría...</option>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <Field label="Competencia" value={newCrit.label}
                onChange={v => setNewCrit({...newCrit, label:v})} placeholder="Ej: Trabajo bajo presión" />
              <Field label="Descripción (opcional)" value={newCrit.desc}
                onChange={v => setNewCrit({...newCrit, desc:v})} placeholder="Breve descripción del criterio..." />
              <button onClick={addCriterion} style={{
                padding:"10px 24px", background:"#CC785C", border:"none", borderRadius:10,
                color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", alignSelf:"flex-end",
                display:"flex", alignItems:"center", gap:6 }}>
                <IcoPlus /> Agregar competencia
              </button>
            </div>
          </div>

          {cats.map(cat => {
            const crs = criteria.filter(c => c.category === cat.id);
            if (!crs.length) return null;
            return (
              <div key={cat.id} style={{ background:"#FFFFFF", border:"1px solid #E8E3DC",
                borderRadius:16, overflow:"hidden" }}>
                <div style={{ padding:"14px 24px", borderBottom:"1px solid #E8E3DC",
                  display:"flex", alignItems:"center", gap:10, background:"#F0EDE8" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:cat.color }} />
                  <span style={{ fontSize:12, fontWeight:700 }}>{cat.name}</span>
                  <span style={{ marginLeft:"auto", fontSize:11, color:"#B5AFA8" }}>{crs.length} items</span>
                </div>
                {crs.map((cr, i) => (
                  <div key={cr.id} style={{
                    padding:"14px 24px", borderBottom: i < crs.length-1 ? "1px solid #E8E3DC" : "none",
                    display:"flex", alignItems:"center", gap:12
                  }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:700 }}>{cr.label}</div>
                      {cr.desc && <div style={{ fontSize:11, color:"#9E9890", marginTop:2 }}>{cr.desc}</div>}
                    </div>
                    <button onClick={() => deleteCriterion(cr.id)} style={{
                      width:32, height:32, borderRadius:8, background:"#E8E3DC", border:"none",
                      cursor:"pointer", color:"#f87171", display:"flex", alignItems:"center",
                      justifyContent:"center", flexShrink:0 }}>
                      <IcoTrash />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ fontSize:10, fontWeight:700, color:"#9E9890", display:"block",
        marginBottom:6, letterSpacing:"0.1em", textTransform:"uppercase" }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", background:"#F5F3EF", border:"1px solid #E8E3DC",
          borderRadius:10, padding:"10px 14px", color:"#1A1714", fontSize:13,
          fontFamily:"inherit", outline:"none", boxSizing:"border-box",
          transition:"border-color .15s" }}
        onFocus={e => e.target.style.borderColor = "#CC785C"}
        onBlur={e => e.target.style.borderColor = "#E8E3DC"} />
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize:10, fontWeight:700, color:"#B5AFA8",
        letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:600, color:"#2D2926" }}>{value}</div>
    </div>
  );
}
