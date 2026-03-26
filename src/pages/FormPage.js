// src/pages/FormPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Toast, useToast, Loading, Field } from "../components/UI";
import { predictAPI } from "../services/api";

const FIELDS = [
  { k:"glucose",            label:"Glucose *",             ph:"mg/dL",  hint:"Normale : 70–99 mg/dL", required:true },
  { k:"pression_arterielle",label:"Pression Artérielle *", ph:"mmHg",   hint:"Pression systolique (ex : 80)", required:true },
  { k:"bmi",                label:"BMI *",                 ph:"kg/m²",  hint:"Indice de masse corporelle", required:true },
  { k:"age",                label:"Âge *",                 ph:"ans",    hint:"Votre âge en années", required:true },
  { k:"insuline",           label:"Insuline",              ph:"µU/mL",  hint:"Optionnel" },
  { k:"epaisseur_peau",     label:"Épaisseur cutanée",     ph:"mm",     hint:"Pli cutané tricipital (optionnel)" },
  { k:"grossesses",         label:"Nombre de grossesses",  ph:"0",      hint:"Pour les femmes uniquement" },
];

export default function FormPage() {
  const nav = useNavigate();
  const { toast, show } = useToast();
  const [loading, setLoading] = useState(false);
  const [vals, setVals] = useState({
    glucose:"", pression_arterielle:"", bmi:"", age:"",
    insuline:"", epaisseur_peau:"", grossesses:"",
  });
  const set = k => e => setVals(v => ({ ...v, [k]: e.target.value }));

  const submit = async () => {
    const missing = FIELDS.filter(f => f.required && !vals[f.k]).map(f => f.label.replace(" *",""));
    if (missing.length) { show(`Champs requis : ${missing.join(", ")}`, "error"); return; }
    setLoading(true);
    try {
      const res = await predictAPI.form(vals);
      show("Prédiction effectuée !", "success");
      setTimeout(() => nav("/results", { state: { latest: res } }), 800);
    } catch (e) { show(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      {loading && <Loading text="Calcul de la prédiction…" />}
      <Toast toast={toast} />
      <div className="fade-in">
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"2rem", marginBottom:8 }}>
          Formulaire Médical
        </h2>
        <p style={{ color:"#64748B", marginBottom:32 }}>
          Remplissez les champs ci-dessous pour obtenir votre prédiction. Les champs marqués <strong>*</strong> sont obligatoires.
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, maxWidth:760 }}>
          {/* Form card */}
          <div className="card" style={{ padding:28, gridColumn:"1 / -1" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              {FIELDS.map(({ k, label, ph, hint }) => (
                <Field key={k} label={label} hint={hint}>
                  <input className="inp" placeholder={ph} type="number" min="0" step="any"
                    value={vals[k]} onChange={set(k)} />
                </Field>
              ))}
            </div>

            <div style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
              <button className="btn btn-outline" onClick={() => setVals({glucose:"",pression_arterielle:"",bmi:"",age:"",insuline:"",epaisseur_peau:"",grossesses:""})}>
                Réinitialiser
              </button>
              <button className="btn btn-primary btn-lg" onClick={submit} disabled={loading}>
                🔬 Prédire
              </button>
            </div>
          </div>
        </div>

        {/* Values guide */}
        <div className="card" style={{ maxWidth:760, marginTop:24, padding:24 }}>
          <h4 style={{ fontWeight:700, marginBottom:16, fontSize:".95rem" }}>📖 Guide des valeurs normales</h4>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {[
              ["Glucose", "70 – 99 mg/dL"],
              ["Pression", "< 80 mmHg"],
              ["BMI", "18.5 – 24.9"],
              ["Âge adulte", "18 – 100 ans"],
              ["Insuline", "2 – 25 µU/mL"],
              ["Épaisseur peau", "< 35 mm"],
            ].map(([k, v]) => (
              <div key={k} style={{ background:"#F8FAFC", padding:"10px 14px", borderRadius:8 }}>
                <div style={{ fontSize:".78rem", color:"#64748B" }}>{k}</div>
                <div style={{ fontWeight:700, fontSize:".9rem", color:"#10B981", marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
