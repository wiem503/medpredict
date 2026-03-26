// src/pages/PdfPage.js
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Toast, useToast, Loading } from "../components/UI";
import { predictAPI } from "../services/api";

export default function PdfPage() {
  const nav = useNavigate();
  const { toast, show } = useToast();
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = f => {
    if (!f) return;
    if (f.type !== "application/pdf") { show("Seuls les fichiers PDF sont acceptés.", "error"); return; }
    if (f.size > 10 * 1024 * 1024)   { show("Fichier trop volumineux (max 10 MB).", "error"); return; }
    setFile(f);
  };

  const analyse = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await predictAPI.pdf(file);
      show("Analyse terminée avec succès !", "success");
      setTimeout(() => nav("/results", { state: { latest: res } }), 800);
    } catch (e) { show(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      {loading && <Loading text="Analyse du PDF en cours…" />}
      <Toast toast={toast} />
      <div className="fade-in">
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"2rem", marginBottom:8 }}>
          Analyser un Bilan Médical
        </h2>
        <p style={{ color:"#64748B", marginBottom:32 }}>
          Uploadez votre bilan sanguin au format PDF. Notre IA en extraira automatiquement les valeurs.
        </p>

        <div className="card" style={{ maxWidth:560, padding:32 }}>
          {/* Drop zone */}
          <div
            onClick={() => inputRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            style={{
              border:`2px dashed ${dragging ? "#0EA5E9" : "#E2EDF7"}`,
              borderRadius:12, padding:"60px 30px", textAlign:"center",
              cursor:"pointer", marginBottom:20,
              background: dragging ? "#E0F2FE" : "#FAFCFF",
              transition:"all .2s",
            }}
          >
            <div style={{ fontSize:"3.5rem", marginBottom:16 }}>📂</div>
            <p style={{ color:"#64748B", fontSize:".95rem", marginBottom:8 }}>
              Glissez et déposez votre fichier PDF ici
            </p>
            <p style={{ color:"#0EA5E9", fontSize:".85rem", fontWeight:600 }}>
              ou cliquez pour sélectionner
            </p>
            <input ref={inputRef} type="file" accept="application/pdf" style={{ display:"none" }}
              onChange={e => handleFile(e.target.files[0])} />
          </div>

          {/* File preview */}
          {file && (
            <div style={{
              display:"flex", alignItems:"center", gap:12,
              background:"#E0F2FE", padding:"14px 18px", borderRadius:10,
              marginBottom:16,
            }}>
              <span style={{ fontSize:"1.4rem" }}>📄</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:".9rem", color:"#0EA5E9" }}>{file.name}</div>
                <div style={{ fontSize:".78rem", color:"#64748B" }}>{(file.size/1024).toFixed(0)} KB</div>
              </div>
              <span onClick={() => setFile(null)} style={{ cursor:"pointer", color:"#64748B", fontSize:1.2+"rem" }}>✕</span>
            </div>
          )}

          <div style={{ display:"grid", gap:12 }}>
            <button className="btn btn-outline btn-block" onClick={() => inputRef.current.click()}>
              📁 Choisir un fichier PDF
            </button>
            <button className="btn btn-primary btn-block" onClick={analyse} disabled={!file || loading}>
              🔬 Analyser le bilan
            </button>
          </div>

          {/* Info */}
          <div style={{ marginTop:20, padding:14, background:"#F8FAFC", borderRadius:8, fontSize:".82rem", color:"#64748B" }}>
            <strong>Valeurs recherchées :</strong> Glucose, Pression artérielle, BMI, Âge, Insuline, Épaisseur peau, Grossesses.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
