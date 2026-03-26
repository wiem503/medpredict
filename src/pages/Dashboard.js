// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { StatCard } from "../components/UI";
import { resultsAPI } from "../services/api";

function ActionCard({ icon, title, desc, to }) {
  const nav = useNavigate();
  const [hover, setHover] = useState(false);
  return (
    <div className="card" onClick={() => nav(to)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding:"28px 22px", textAlign:"center", cursor:"pointer", transition:"all .22s",
        borderColor: hover ? "#0EA5E9" : "#E2EDF7",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "0 10px 32px rgba(14,165,233,.18)" : "0 4px 24px rgba(14,165,233,.09)",
      }}
    >
      <div style={{ fontSize:"2.2rem", marginBottom:16 }}>{icon}</div>
      <h4 style={{ fontWeight:700, marginBottom:6 }}>{title}</h4>
      <p style={{ fontSize:".82rem", color:"#64748B", lineHeight:1.5 }}>{desc}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user }    = useAuth();
  const [stats, setStats] = useState(null);
  const nav = useNavigate();

  useEffect(() => { resultsAPI.stats().then(setStats).catch(() => {}); }, []);

  const riskColor = r => r === "élevé" ? "#EF4444" : r === "modéré" ? "#F59E0B" : "#10B981";

  return (
    <DashboardLayout>
      <div className="fade-in">

        {/* Welcome banner */}
        <div style={{
          background:"linear-gradient(135deg, #EFF8FF 0%, #E0F2FE 100%)",
          borderRadius:16, padding:"36px 40px", marginBottom:32,
          border:"1px solid #E2EDF7", position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", right:-40, top:-40, width:200, height:200,
            borderRadius:"50%", background:"rgba(14,165,233,.06)", pointerEvents:"none",
          }}/>
          <p style={{ fontSize:".85rem", color:"#0EA5E9", fontWeight:600, marginBottom:6 }}>
            {new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}
          </p>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"2rem", marginBottom:8 }}>
            Bienvenue{user?.nom ? `, ${user.nom}` : ""} ! 👋
          </h2>
          <p style={{ color:"#64748B", fontSize:"1rem" }}>
            Prédisez votre santé à partir d'analyses médicales. Choisissez une option ci-dessous.
          </p>
        </div>

        {/* Stats */}
        {stats && stats.total > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:32 }}>
            <StatCard icon="🔬" value={stats.total} label="Analyses effectuées" />
            <StatCard icon="📊" value={`${stats.avg_probability}%`} label="Probabilité moyenne" color="#F59E0B" />
            <StatCard
              icon="🎯"
              value={stats.last_analysis?.risk_level || "—"}
              label="Dernier risque détecté"
              color={riskColor(stats.last_analysis?.risk_level)}
            />
          </div>
        )}

        {/* Action cards */}
        <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"1.4rem", marginBottom:20 }}>
          Que souhaitez-vous faire ?
        </h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:36 }}>
          <ActionCard icon="📄" title="Analyser un PDF"       desc="Uploadez un bilan médical PDF pour une analyse automatique."     to="/pdf" />
          <ActionCard icon="📋" title="Remplir le formulaire" desc="Saisissez manuellement vos valeurs biologiques."                   to="/form" />
          <ActionCard icon="📊" title="Voir mes résultats"    desc="Consultez l'historique de vos analyses et prédictions."           to="/results" />
        </div>

        {/* CTA */}
        <div style={{ textAlign:"center" }}>
          <button className="btn btn-primary btn-lg" onClick={() => nav("/pdf")}>
            🔬 Lancer une analyse
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
