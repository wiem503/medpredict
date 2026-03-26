// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, clearTokens } from "../services/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [ready, setReady]   = useState(false);

  useEffect(() => {
    if (authAPI.isLoggedIn()) {
      authAPI.me().then(setUser).catch(() => clearTokens()).finally(() => setReady(true));
    } else setReady(true);
  }, []);

  const login    = async (e, p)    => { const u = await authAPI.login(e, p);    setUser(u); return u; };
  const register = async (e, p, n) => { const u = await authAPI.register(e, p, n); setUser(u); return u; };
  const logout   = async ()        => { await authAPI.logout(); setUser(null); };

  return (
    <AuthCtx.Provider value={{ user, setUser, ready, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
