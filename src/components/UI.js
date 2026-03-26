// src/components/UI.js
import { useEffect, useState } from "react";

/* ── Toast hook ── */
export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3400);
  };
  return { toast, show };
}

/* ── Toast component ── */
export function Toast({ toast }) {
  if (!toast) return null;
  const bg = toast.type === "error" ? "#EF4444" : toast.type === "success" ? "#10B981" : "#0F172A";
  return (
    <div style={{
      position:"fixed", bottom:28, right:28, zIndex:9999,
      background:bg, color:"#fff", padding:"14px 24px",
      borderRadius:10, fontSize:".9rem", fontWeight:500,
      boxShadow:"0 8px 24px rgba(0,0,0,.18)",
      animation:"fadeIn .3s ease",
    }}>{toast.msg}</div>
  );
}

/* ── Loading overlay ── */
export function Loading({ text = "Chargement…" }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(255,255,255,.88)",
      zIndex:500, display:"flex", alignItems:"center",
      justifyContent:"center", flexDirection:"column", gap:20,
    }}>
      <div className="spin" style={{ width:48, height:48, border:"4px solid #E2EDF7", borderTopColor:"#0EA5E9", borderRadius:"50%" }} />
      <div style={{ color:"#64748B", fontWeight:600 }}>{text}</div>
    </div>
  );
}

/* ── Logo ── */
export function Logo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, fontWeight:700, fontSize:"1.15rem", color:"#0F172A" }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#E0F2FE"/>
        <path d="M16 8v16M8 16h16" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
      MedPredict<span style={{ color:"#0EA5E9" }}>AI</span>
    </div>
  );
}

/* ── Stat card ── */
export function StatCard({ icon, value, label, color = "#0EA5E9" }) {
  return (
    <div className="card" style={{ padding:20, textAlign:"center" }}>
      <div style={{ fontSize:"1.8rem", marginBottom:8 }}>{icon}</div>
      <div style={{ fontWeight:700, fontSize:"1.4rem", color }}>{value}</div>
      <div style={{ fontSize:".8rem", color:"#64748B", marginTop:4 }}>{label}</div>
    </div>
  );
}

/* ── Form field ── */
export function Field({ label, children, hint }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p style={{ fontSize:".76rem", color:"#64748B", marginTop:4 }}>{hint}</p>}
    </div>
  );
}

/* ── Section title ── */
export function SectionTitle({ children }) {
  return <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"1.3rem", marginBottom:16 }}>{children}</h3>;
}

/* ── Risk badge ── */
export function RiskBadge({ level, prob }) {
  const map = {
    "élevé":  { cls:"badge-danger",  icon:"⚠️" },
    "modéré": { cls:"badge-warning", icon:"🔶" },
    "faible": { cls:"badge-success", icon:"✅" },
  };
  const { cls, icon } = map[level] || map["faible"];
  return (
    <div className={`badge ${cls}`} style={{ fontSize:".95rem" }}>
      {icon} Risque {level} — {prob}%
    </div>
  );
}

/* ── Prob bar ── */
export function ProbBar({ value }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 100); return () => clearTimeout(t); }, [value]);
  return (
    <div className="prob-bar-track" style={{ flex:1 }}>
      <div className="prob-bar-fill" style={{ width:`${w}%` }} />
    </div>
  );
}

/* ── Empty state ── */
export function Empty({ icon="📭", title, desc, action, actionLabel }) {
  return (
    <div className="card" style={{ padding:60, textAlign:"center" }}>
      <div style={{ fontSize:"4rem", marginBottom:16 }}>{icon}</div>
      {title && <h3 style={{ fontWeight:700, marginBottom:8 }}>{title}</h3>}
      {desc  && <p style={{ color:"#64748B" }}>{desc}</p>}
      {action && (
        <button className="btn btn-primary" style={{ marginTop:24 }} onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
