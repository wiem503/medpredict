// src/pages/ProfilePage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { Toast, useToast, Loading, Field } from "../components/UI";
import { profileAPI } from "../services/api";

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const nav = useNavigate();
  const { toast, show } = useToast();
  const [loading, setLoading]   = useState(false);
  const [tab, setTab]           = useState("info");   // info | password | danger
  const [form, setForm]         = useState({ nom:user?.nom||"", email:user?.email||"", telephone:user?.telephone||"" });
  const [pw, setPw]             = useState({ old_password:"", new_password:"", confirm:"" });
  const set  = k => e => setForm(v => ({ ...v, [k]: e.target.value }));
  const setPwF = k => e => setPw(v => ({ ...v, [k]: e.target.value }));

  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await profileAPI.update(form);
      setUser(res.user);
      show("Profil mis à jour.", "success");
    } catch (e) { show(e.message, "error"); }
    finally { setLoading(false); }
  };

  const changePassword = async () => {
    if (pw.new_password !== pw.confirm) { show("Les mots de passe ne correspondent pas.", "error"); return; }
    if (pw.new_password.length < 6)     { show("Nouveau mot de passe trop court.", "error"); return; }
    setLoading(true);
    try {
      await profileAPI.changePassword(pw.old_password, pw.new_password);
      setPw({ old_password:"", new_password:"", confirm:"" });
      show("Mot de passe modifié.", "success");
    } catch (e) { show(e.message, "error"); }
    finally { setLoading(false); }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Supprimer définitivement votre compte et toutes vos données ?")) return;
    setLoading(true);
    try { await profileAPI.deleteAccount(); await logout(); nav("/"); }
    catch (e) { show(e.message, "error"); setLoading(false); }
  };

  const tabStyle = active => ({
    padding:"10px 20px", borderRadius:8, fontWeight:600, fontSize:".88rem",
    cursor:"pointer", border:"none", fontFamily:"'DM Sans',sans-serif",
    background: active ? "#0EA5E9" : "#F1F5F9",
    color: active ? "#fff" : "#64748B",
    transition:"all .18s",
  });

  return (
    <DashboardLayout>
      {loading && <Loading text="Sauvegarde…" />}
      <Toast toast={toast} />
      <div className="fade-in">
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"2rem", marginBottom:8 }}>Mon Profil</h2>
        <p style={{ color:"#64748B", marginBottom:28 }}>Gérez vos informations personnelles et la sécurité de votre compte.</p>

        {/* Avatar + info */}
        <div className="card" style={{ padding:24, marginBottom:24, display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"#E0F2FE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem", flexShrink:0 }}>
            👤
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:"1.1rem" }}>{user?.nom || "Utilisateur"}</div>
            <div style={{ color:"#64748B", fontSize:".88rem" }}>{user?.email}</div>
            <div style={{ fontSize:".78rem", color:"#0EA5E9", marginTop:4 }}>
              Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR", { month:"long", year:"numeric" }) : "—"}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:10, marginBottom:24 }}>
          <button style={tabStyle(tab==="info")}     onClick={() => setTab("info")}>✏️ Informations</button>
          <button style={tabStyle(tab==="password")} onClick={() => setTab("password")}>🔒 Mot de passe</button>
          <button style={tabStyle(tab==="danger")}   onClick={() => setTab("danger")}>⚠️ Zone de danger</button>
        </div>

        {/* Info tab */}
        {tab === "info" && (
          <div className="card" style={{ maxWidth:520, padding:28 }}>
            <div style={{ display:"grid", gap:16, marginBottom:24 }}>
              <Field label="Nom complet">
                <input className="inp" placeholder="Votre nom" value={form.nom} onChange={set("nom")} />
              </Field>
              <Field label="Adresse email">
                <input className="inp" type="email" placeholder="email@exemple.com" value={form.email} onChange={set("email")} />
              </Field>
              <Field label="Téléphone">
                <input className="inp" placeholder="+216 XX XXX XXX" value={form.telephone} onChange={set("telephone")} />
              </Field>
            </div>
            <button className="btn btn-primary btn-block" onClick={saveProfile}>Sauvegarder les modifications</button>
          </div>
        )}

        {/* Password tab */}
        {tab === "password" && (
          <div className="card" style={{ maxWidth:480, padding:28 }}>
            <div style={{ display:"grid", gap:16, marginBottom:24 }}>
              <Field label="Ancien mot de passe">
                <input className="inp" type="password" placeholder="••••••••" value={pw.old_password} onChange={setPwF("old_password")} />
              </Field>
              <Field label="Nouveau mot de passe">
                <input className="inp" type="password" placeholder="Min. 6 caractères" value={pw.new_password} onChange={setPwF("new_password")} />
              </Field>
              <Field label="Confirmer le nouveau mot de passe">
                <input className="inp" type="password" placeholder="••••••••" value={pw.confirm} onChange={setPwF("confirm")} />
              </Field>
            </div>
            <button className="btn btn-primary btn-block" onClick={changePassword}>Mettre à jour le mot de passe</button>
          </div>
        )}

        {/* Danger tab */}
        {tab === "danger" && (
          <div className="card" style={{ maxWidth:480, padding:28, borderColor:"#FECACA" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <span style={{ fontSize:"1.5rem" }}>⚠️</span>
              <div>
                <div style={{ fontWeight:700, color:"#EF4444" }}>Supprimer le compte</div>
                <div style={{ fontSize:".85rem", color:"#64748B" }}>Cette action est irréversible.</div>
              </div>
            </div>
            <p style={{ fontSize:".88rem", color:"#64748B", marginBottom:20 }}>
              Toutes vos données (analyses, résultats, profil) seront définitivement supprimées. Vous ne pourrez pas récupérer votre compte.
            </p>
            <button className="btn btn-danger btn-block" onClick={deleteAccount}>
              🗑 Supprimer définitivement mon compte
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
