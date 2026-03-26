// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing     from "./pages/Landing";
import Auth        from "./pages/Auth";
import Dashboard   from "./pages/Dashboard";
import PdfPage     from "./pages/PdfPage";
import FormPage    from "./pages/FormPage";
import ResultsPage from "./pages/ResultsPage";
import ProfilePage from "./pages/ProfilePage";

/* Protected route – redirects to /login if not authenticated */
function Private({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? children : <Navigate to="/login" replace />;
}

/* Public-only route – redirects to /dashboard if already logged in */
function PublicOnly({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<PublicOnly><Auth mode="login" /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Auth mode="register" /></PublicOnly>} />

      {/* Private */}
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/pdf"       element={<Private><PdfPage /></Private>} />
      <Route path="/form"      element={<Private><FormPage /></Private>} />
      <Route path="/results"   element={<Private><ResultsPage /></Private>} />
      <Route path="/profile"   element={<Private><ProfilePage /></Private>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
