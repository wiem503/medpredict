// src/services/api.js
const BASE = "/api";

const getToken    = () => localStorage.getItem("access_token");
const setTokens   = (a, r) => { localStorage.setItem("access_token", a); if (r) localStorage.setItem("refresh_token", r); };
export const clearTokens = () => { localStorage.removeItem("access_token"); localStorage.removeItem("refresh_token"); };

async function req(path, opts = {}) {
  const headers = { ...opts.headers };
  if (!(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const tok = getToken();
  if (tok) headers["Authorization"] = `Bearer ${tok}`;

  const res  = await fetch(`${BASE}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && path !== "/auth/refresh") {
    const ok = await tryRefresh();
    if (ok) return req(path, opts);
    clearTokens();
    window.location.href = "/";
    return;
  }
  if (!res.ok) throw new Error(data.error || "Erreur serveur");
  return data;
}

async function tryRefresh() {
  const rt = localStorage.getItem("refresh_token");
  if (!rt) return false;
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST", headers: { Authorization: `Bearer ${rt}` },
    });
    if (!res.ok) return false;
    const d = await res.json();
    setTokens(d.access_token);
    return true;
  } catch { return false; }
}

/* ── AUTH ── */
export const authAPI = {
  register: async (email, password, nom = "") => {
    const d = await req("/auth/register", { method:"POST", body: JSON.stringify({ email, password, nom }) });
    setTokens(d.access_token, d.refresh_token);
    return d.user;
  },
  login: async (email, password) => {
    const d = await req("/auth/login", { method:"POST", body: JSON.stringify({ email, password }) });
    setTokens(d.access_token, d.refresh_token);
    return d.user;
  },
  logout:    async () => { try { await req("/auth/logout", { method:"POST" }); } catch {} clearTokens(); },
  me:        ()      => req("/auth/me"),
  isLoggedIn:()      => Boolean(getToken()),
};

/* ── PREDICT ── */
export const predictAPI = {
  form: (data)    => req("/predict/form", { method:"POST", body: JSON.stringify(data) }),
  pdf:  async (file) => {
    const fd = new FormData(); fd.append("file", file);
    const tok = getToken();
    const res = await fetch(`${BASE}/predict/pdf`, {
      method:"POST", headers: tok ? { Authorization:`Bearer ${tok}` } : {}, body:fd,
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.error || "Erreur analyse PDF");
    return d;
  },
};

/* ── RESULTS ── */
export const resultsAPI = {
  list:   ({ page=1, limit=10, source }={}) => {
    const qs = new URLSearchParams({ page, limit, ...(source ? {source} : {}) });
    return req(`/results?${qs}`);
  },
  get:    (id) => req(`/results/${id}`),
  delete: (id) => req(`/results/${id}`, { method:"DELETE" }),
  stats:  ()   => req("/results/stats"),
};

/* ── PROFILE ── */
export const profileAPI = {
  get:            ()      => req("/profile"),
  update:         (data)  => req("/profile", { method:"PUT", body:JSON.stringify(data) }),
  changePassword: (o, n)  => req("/profile/password", { method:"PUT", body:JSON.stringify({ old_password:o, new_password:n }) }),
  deleteAccount:  ()      => req("/profile", { method:"DELETE" }),
};
