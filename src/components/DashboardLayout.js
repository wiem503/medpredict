// src/components/DashboardLayout.js
import Navbar  from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"#F0F7FF" }}>
      <Navbar />
      <div style={{ flex:1, display:"flex" }}>
        <Sidebar />
        <main style={{ flex:1, padding:"40px 48px", overflowY:"auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
