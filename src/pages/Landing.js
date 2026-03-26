// src/pages/Landing.js
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function HeroIllustration() {
  return (
    <svg width="380" height="290" viewBox="0 0 380 290" fill="none">
      {/* Clipboard */}
      <rect x="90" y="20" width="200" height="250" rx="18" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="2"/>
      <rect x="140" y="5"  width="100" height="30"  rx="9" fill="#0EA5E9"/>
      <rect x="110" y="65" width="160" height="12"  rx="6" fill="#BAE6FD"/>
      <rect x="110" y="89" width="120" height="10"  rx="5" fill="#BAE6FD"/>
      <rect x="110" y="109" width="140" height="10" rx="5" fill="#BAE6FD"/>
      <rect x="110" y="129" width="100" height="10" rx="5" fill="#BAE6FD"/>
      <rect x="110" y="149" width="130" height="10" rx="5" fill="#BAE6FD"/>
      {/* Checkmark circle */}
      <circle cx="250" cy="210" r="30" fill="#0EA5E9"/>
      <path d="M236 210l11 11 19-19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Doctor left */}
      <circle cx="52"  cy="148" r="26" fill="#FDE68A"/>
      <rect   x="34"  y="170"  width="36" height="45" rx="10" fill="#BFDBFE"/>
      <ellipse cx="52" cy="235" rx="38"  ry="50" fill="#DBEAFE"/>
      {/* Doctor right */}
      <circle cx="328" cy="148" r="26" fill="#FDE68A"/>
      <rect   x="310" y="170" width="36" height="45" rx="10" fill="#0EA5E9"/>
      <ellipse cx="328" cy="235" rx="38" ry="50" fill="#BFDBFE"/>
      {/* Floating pills */}
      <rect x="20" y="70" width="28" height="12" rx="6" fill="#A5F3FC" opacity=".8"/>
      <rect x="332" y="80" width="28" height="12" rx="6" fill="#A5F3FC" opacity=".8"/>
      <circle cx="38"  cy="200" r="7" fill="#FCA5A5" opacity=".7"/>
      <circle cx="342" cy="200" r="7" fill="#86EFAC" opacity=".7"/>
    </svg>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card" style={{ padding:28, textAlign:"center", flex:1 }}>
      <div style={{ fontSize:"2.2rem", marginBottom:14 }}>{icon}</div>
      <h4 style={{ fontWeight:700, marginBottom:8 }}>{title}</h4>
      <p style={{ fontSize:".88rem", color:"#64748B", lineHeight:1.6 }}>{desc}</p>
    </div>
  );
}

export default function Landing() {
  const nav = useNavigate();

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"#F0F7FF" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        flex:1, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"72px 64px", background:"#fff", position:"relative", overflow:"hidden",
      }}>
        {/* Background blob */}
        <div style={{
          position:"absolute", right:-120, top:-100, width:550, height:550,
          borderRadius:"50%", background:"radial-gradient(circle,rgba(14,165,233,.07) 0%,transparent 70%)",
          pointerEvents:"none",
        }}/>

        <div style={{ maxWidth:500, zIndex:1 }} className="fade-in">
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"#E0F2FE", color:"#0EA5E9", padding:"6px 14px",
            borderRadius:99, fontSize:".82rem", fontWeight:600, marginBottom:24,
          }}>
            🤖 Propulsé par l'Intelligence Artificielle
          </div>

          <h1 style={{
            fontFamily:"'DM Serif Display',serif",
            fontSize:"3.4rem", lineHeight:1.08, marginBottom:20,
          }}>
            Bienvenue sur<br/>
            MedPredict <span style={{ color:"#0EA5E9" }}>AI</span>
          </h1>

          <p style={{ color:"#64748B", fontSize:"1.1rem", lineHeight:1.7, marginBottom:40 }}>
            Prédisez votre risque de diabète à partir de vos analyses médicales,
            grâce à un modèle d'IA entraîné sur des milliers de données cliniques.
          </p>

          <div style={{ display:"flex", gap:16 }}>
            <button className="btn btn-primary btn-lg" onClick={() => nav("/register")}>
              🚀 Commencer gratuitement
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => nav("/login")}>
              Se connecter
            </button>
          </div>

          <div style={{ display:"flex", gap:28, marginTop:36 }}>
            {[["🔬","Analyse PDF"],["📋","Formulaire"],["📊","Résultats"]].map(([i,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:8, fontSize:".88rem", color:"#64748B" }}>
                <span>{i}</span><span>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-in" style={{ animationDelay:".15s" }}>
          <HeroIllustration />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:"64px", background:"#F0F7FF" }}>
        <h2 style={{
          fontFamily:"'DM Serif Display',serif", fontSize:"2.2rem",
          textAlign:"center", marginBottom:48,
        }}>
          Comment ça marche ?
        </h2>
        <div style={{ display:"flex", gap:24, maxWidth:900, margin:"0 auto" }}>
          <FeatureCard icon="📄" title="Uploadez votre bilan"
            desc="Importez votre bilan médical en PDF. Notre IA en extrait automatiquement les valeurs clés." />
          <FeatureCard icon="🤖" title="Analyse intelligente"
            desc="Notre modèle RandomForest analyse vos données biologiques en quelques secondes." />
          <FeatureCard icon="📊" title="Résultats & conseils"
            desc="Obtenez votre niveau de risque, une probabilité précise et des conseils personnalisés." />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"56px 64px", background:"#0EA5E9", textAlign:"center" }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"2rem", color:"#fff", marginBottom:16 }}>
          Prenez soin de votre santé dès aujourd'hui
        </h2>
        <p style={{ color:"rgba(255,255,255,.85)", marginBottom:32, fontSize:"1rem" }}>
          Inscription gratuite — Aucune carte bancaire requise
        </p>
        <button className="btn btn-lg" onClick={() => nav("/register")}
          style={{ background:"#fff", color:"#0EA5E9", fontWeight:700 }}>
          Créer mon compte gratuit
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#0F172A", color:"rgba(255,255,255,.5)", padding:"24px 64px", textAlign:"center", fontSize:".85rem" }}>
        © 2025 MedPredictAI — Outil d'aide à la décision, ne remplace pas un avis médical professionnel.
      </footer>
    </div>
  );
}
