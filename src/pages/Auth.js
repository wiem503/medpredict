// src/pages/Auth.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo, Toast, useToast, Loading } from "../components/UI";

export default function Auth({ mode: initMode = "login" }) {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const { toast, show } = useToast();
  const [mode, setMode]     = useState(initMode);
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({ email:"", password:"", nom:"", confirm:"" });
  const set = k => e => setForm(v => ({ ...v, [k]: e.target.value }));

  const submit = async () => {
    if (!form.email || !form.password) { show("Email et mot de passe requis.", "error"); return; }
    if (mode === "register" && form.password !== form.confirm) { show("Les mots de passe ne correspondent pas.", "error"); return; }
    setLoading(true);
    try {
      if (mode === "login")    await login(form.email, form.password);
      else                     await register(form.email, form.password, form.nom);
      nav("/dashboard");
    } catch (e) { show(e.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"#F0F7FF" }}>
      {loading && <Loading text={mode === "login" ? "Connexion…" : "Création du compte…"} />}
      <Toast toast={toast} />

      {/* Top bar */}
      <div style={{ padding:"20px 48px", background:"#fff", borderBottom:"1px solid #E2EDF7", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ cursor:"pointer" }} onClick={() => nav("/")}><Logo /></div>
        <button className="btn btn-outline" onClick={() => nav("/")}>← Accueil</button>
      </div>

      {/* Card */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div className="card fade-in" style={{ width:"100%", maxWidth:440, padding:"40px 36px" }}>

          {/* Icon */}
          <div style={{ width:56, height:56, background:"#E0F2FE", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.6rem", marginBottom:20 }}>
            {mode === "login" ? "🔐" : "✨"}
          </div>

          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"1.9rem", marginBottom:6 }}>
            {mode === "login" ? "Bon retour !" : "Créer un compte"}
          </h2>
          <p style={{ color:"#64748B", fontSize:".9rem", marginBottom:28 }}>
            {mode === "login" ? "Connectez-vous pour accéder à votre espace." : "Rejoignez MedPredictAI gratuitement."}
          </p>

          <div style={{ display:"grid", gap:16, marginBottom:24 }}>
            {mode === "register" && (
              <div>
                <label className="label">Nom complet</label>
                <input className="inp" placeholder="Votre nom" value={form.nom} onChange={set("nom")} />
              </div>
            )}
            <div>
              <label className="label">Adresse email</label>
              <input className="inp" type="email" placeholder="email@exemple.com" value={form.email} onChange={set("email")} />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <input className="inp" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} onKeyDown={e => e.key==="Enter" && submit()} />
            </div>
            {mode === "register" && (
              <div>
                <label className="label">Confirmer le mot de passe</label>
                <input className="inp" type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} onKeyDown={e => e.key==="Enter" && submit()} />
              </div>
            )}
          </div>

          <button className="btn btn-primary btn-lg btn-block" onClick={submit} disabled={loading}>
            {mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>

          <p style={{ textAlign:"center", marginTop:20, fontSize:".88rem", color:"#64748B" }}>
            {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <span
              style={{ color:"#0EA5E9", cursor:"pointer", fontWeight:600 }}
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "S'inscrire" : "Se connecter"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
