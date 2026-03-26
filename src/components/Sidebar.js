// src/components/Sidebar.js
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./UI";

const links = [
  { to:"/dashboard",  icon:"🏠", label:"Tableau de Bord" },
  { to:"/pdf",        icon:"📄", label:"Analyser PDF" },
  { to:"/form",       icon:"📋", label:"Formulaire Médical" },
  { to:"/results",    icon:"📊", label:"Mes Résultats" },
  { to:"/profile",    icon:"👤", label:"Mon Profil" },
];

export default function Sidebar() {
  const nav      = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside style={{
      width:220, minHeight:"calc(100vh - 61px)",
      background:"#F8FBFF", borderRight:"1px solid #E2EDF7",
      padding:"24px 0", flexShrink:0,
    }}>
      <div style={{ padding:"0 20px 20px", borderBottom:"1px solid #E2EDF7", marginBottom:12 }}>
        <Logo />
      </div>

      {links.map(l => (
        <div
          key={l.to}
          className={`sidebar-link${pathname === l.to ? " active" : ""}`}
          onClick={() => nav(l.to)}
        >
          <span>{l.icon}</span>
          <span>{l.label}</span>
        </div>
      ))}
    </aside>
  );
}
