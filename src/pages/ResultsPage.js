// src/pages/ResultsPage.js
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Toast, useToast, Empty, RiskBadge, ProbBar, SectionTitle } from "../components/UI";
import { resultsAPI } from "../services/api";

function AnalysisCard({ a, selected, onClick }) {
  const riskColor = r => r === "élevé" ? "#EF4444" : r === "modéré" ? "#F59E0B" : "#10B981";
  return (
    <div className="card" onClick={onClick} style={{
      padding:16, cursor:"pointer", transition:"all .2s",
      borderColor: selected ? "#0EA5E9" : "#E2EDF7",
      borderWidth: selected ? 2 : 1,
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontSize:".78rem", background: selected?"#E0F2FE":"#F8FAFC", color:"#0EA5E9", padding:"2px 10px", borderRadius:99, fontWeight:600 }}>
          {a.source === "pdf" ? "📄 PDF" : "📋 Form"}
        </span>
        <span style={{ fontSize:".75rem", color:"#64748B" }}>
          {new Date(a.created_at).toLocaleDateString("fr-FR")}
        </span>
      </div>
      <div style={{ fontWeight:800, fontSize:"1.3rem", color:riskColor(a.risk_level) }}>{a.probability}%</div>
      <div style={{ fontSize:".8rem", color:"#64748B", textTransform:"capitalize" }}>Risque {a.risk_level}</div>
    </div>
  );
}

export default function ResultsPage() {
  const nav      = useNavigate();
  const location = useLocation();
  const { toast, show } = useToast();

  const [list, setList]         = useState([]);
  const [selected, setSelected] = useState(location.state?.latest || null);
  const [loading, setLoading]   = useState(true);
  const [stats, setStats]       = useState(null);

  useEffect(() => {
    Promise.all([
      resultsAPI.list({ limit:50 }),
      resultsAPI.stats(),
    ]).then(([d, s]) => {
      setList(d.results || []);
      setStats(s);
      if (!selected && d.results?.length) setSelected(d.results[0]);
    }).catch(() => show("Impossible de charger les résultats.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    try {
      await resultsAPI.delete(id);
      setList(l => l.filter(a => a.id !== id));
      if (selected?.id === id) setSelected(null);
      show("Analyse supprimée.", "success");
    } catch { show("Erreur lors de la suppression.", "error"); }
  };

  const labelMap = {
    glucose:"Glucose", pression_arterielle:"Pression Art.",
    bmi:"BMI", age:"Âge", insuline:"Insuline",
    epaisseur_peau:"Épais. peau", grossesses:"Grossesses",
  };

  if (loading) return <DashboardLayout><div style={{ textAlign:"center", padding:80, color:"#64748B" }}>Chargement…</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <Toast toast={toast} />
      <div className="fade-in">
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"2rem", marginBottom:8 }}>Mes Analyses</h2>
        <p style={{ color:"#64748B", marginBottom:28 }}>Historique de toutes vos prédictions médicales.</p>

        {/* Stats bar */}
        {stats && stats.total > 0 && (
          <div style={{ display:"flex", gap:16, marginBottom:28 }}>
            {[
              { label:"Total", value:stats.total },
              { label:"Probabilité moy.", value:`${stats.avg_probability}%` },
              { label:"Risques élevés", value:stats.risk_distribution["élevé"] || 0 },
              { label:"Risques faibles", value:stats.risk_distribution["faible"] || 0 },
            ].map(s => (
              <div key={s.label} style={{ background:"#fff", borderRadius:10, padding:"12px 20px", border:"1px solid #E2EDF7", flex:1, textAlign:"center" }}>
                <div style={{ fontWeight:700, fontSize:"1.2rem", color:"#0EA5E9" }}>{s.value}</div>
                <div style={{ fontSize:".78rem", color:"#64748B", marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {list.length === 0 ? (
          <Empty icon="📊" title="Aucune analyse" desc="Analysez un PDF ou remplissez le formulaire médical."
            action={() => nav("/pdf")} actionLabel="Commencer une analyse" />
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:24, alignItems:"start" }}>

            {/* List */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {list.map(a => (
                <AnalysisCard key={a.id} a={a} selected={selected?.id === a.id} onClick={() => setSelected(a)} />
              ))}
            </div>

            {/* Detail */}
            {selected && (
              <div className="card" style={{ padding:32 }}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
                  <div>
                    <RiskBadge level={selected.risk_level} prob={selected.probability} />
                    <p style={{ fontSize:".82rem", color:"#64748B", marginTop:10 }}>
                      {selected.source === "pdf" ? "📄 Analyse PDF" : "📋 Formulaire"} · {new Date(selected.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <button className="btn btn-danger" style={{ fontSize:".82rem", padding:"8px 14px" }} onClick={() => remove(selected.id)}>
                    🗑 Supprimer
                  </button>
                </div>

                {/* Probability bar */}
                <div style={{ marginBottom:28 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:10 }}>
                    <span style={{ fontWeight:600, fontSize:".9rem", color:"#64748B", minWidth:200 }}>Probabilité de diabète</span>
                    <span style={{ fontWeight:800, fontSize:"1.3rem", color: selected.risk_level==="élevé"?"#EF4444":selected.risk_level==="modéré"?"#F59E0B":"#10B981" }}>
                      {selected.probability}%
                    </span>
                    <ProbBar value={selected.probability} />
                  </div>
                </div>

                {/* Input data */}
                {selected.input_data && Object.keys(selected.input_data).length > 0 && (
                  <div style={{ marginBottom:28 }}>
                    <SectionTitle>Valeurs analysées</SectionTitle>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                      {Object.entries(selected.input_data).filter(([,v])=>v).map(([k,v]) => (
                        <div key={k} style={{ background:"#F8FAFC", padding:"10px 14px", borderRadius:8 }}>
                          <div style={{ fontSize:".75rem", color:"#64748B" }}>{labelMap[k] || k}</div>
                          <div style={{ fontWeight:700, fontSize:".95rem", marginTop:2 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advice */}
                <SectionTitle>Conseils personnalisés</SectionTitle>
                <ul style={{ listStyle:"none" }}>
                  {selected.advice.map((tip, i) => (
                    <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom: i < selected.advice.length-1 ? "1px solid #E2EDF7" : "none", fontSize:".9rem" }}>
                      <span style={{ color:"#10B981", fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
