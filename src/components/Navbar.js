// src/components/Navbar.js
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./UI";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => { await logout(); nav("/"); };

  return (
    <nav style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"16px 48px", background:"#fff",
      borderBottom:"1px solid #E2EDF7", position:"sticky", top:0, zIndex:100,
      boxShadow:"0 2px 12px rgba(14,165,233,.07)",
    }}>
      <div style={{ cursor:"pointer" }} onClick={() => nav(user ? "/dashboard" : "/")}>
        <Logo />
      </div>

      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        {user ? (
          <>
            <span style={{ fontSize:".88rem", color:"#64748B" }}>
              👤 {user.nom || user.email}
            </span>
            <button className="btn btn-outline" onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          <>
            <button className="btn btn-outline" onClick={() => nav("/login")}>Se connecter</button>
            <button className="btn btn-primary" onClick={() => nav("/register")}>Créer un compte</button>
          </>
        )}
      </div>
    </nav>
  );
}
