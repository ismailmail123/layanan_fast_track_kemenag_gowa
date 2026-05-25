// import AlurProsedur from '../components/AlurProsedur';
// import HeroSection from '../components/Hero';
// import Navbar from '../components/Navbar';
// import Services from '../components/Services';
// import FormSection from '../components/FormSection';
// import Footer from '../components/Footer';


// function Homepage() {
//   return (
// 	<>
// 	<Navbar />
// 	<HeroSection />
// 	<Services />
// 	<AlurProsedur />
// 	<FormSection />
// 	<Footer />
// 	</>
//   )
// }

// export default Homepage

// ============================================================
// App.jsx - Main Application with Navigation
// ============================================================
import { useState, useEffect } from "react";
import ScanPage from "./ScanPage";
import HariIniPage from "./HariIniPage";
import SemuaDataPage from "./SemuaDataPage";
import GeneratorPage from "./GeneratorPage";
import { formatWaktu } from "../utils/index";

// ── Ganti dengan URL Web App Google Apps Script Anda ──────
// export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRweDc3S0EkjonIpznP5Z7Yl091OEMRY2nqXvoz5BFwRiDGdNBefkjd9MU_QNELS-I3Q/exec";

const NAV_ITEMS = [
  { id: "scan",      label: "Scan Kontrol", icon: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" },
  { id: "hariini",  label: "Hari Ini",     icon: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" },
  { id: "semua",    label: "Semua Data",   icon: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" },
  { id: "generator",label: "Generator QR", icon: "M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-5.99 4h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-4 2h2v2h-2zm2-6h2v2h-2zm2 4h2v2h-2zm2-2h2v2h-2z" }
];

export default function App() {
  const [page, setPage] = useState("scan");
  const [jam, setJam] = useState(formatWaktu());

  useEffect(() => {
    const t = setInterval(() => setJam(formatWaktu()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* ── TOP HEADER ─────────────────────────────────── */}
      <header style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Logo */}
          <div style={{
            width: 38, height: 38,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, color: "#f1f5f9" }}>
              SIPATROLI
            </div>
            <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 0.5 }}>
              Sistem Kontrol Keliling · Rutan
            </div>
          </div>
        </div>

        {/* Jam */}
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 18, fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: "#60a5fa",
            letterSpacing: 1
          }}>{jam}</div>
          <div style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
            WITA
          </div>
        </div>
      </header>

      {/* ── CONTENT ────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "20px 16px 100px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
        {page === "scan"      && <ScanPage />}
        {page === "hariini"   && <HariIniPage />}
        {page === "semua"     && <SemuaDataPage />}
        {page === "generator" && <GeneratorPage />}
      </main>

      {/* ── BOTTOM NAV ─────────────────────────────────── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(15,15,26,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        zIndex: 100
      }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              flex: 1, padding: "10px 4px 14px",
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4,
              transition: "all 0.2s",
              color: page === item.id ? "#60a5fa" : "#475569"
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill={page === item.id ? "#60a5fa" : "#475569"}>
              <path d={item.icon}/>
            </svg>
            <span style={{
              fontSize: 9, fontWeight: page === item.id ? 700 : 400,
              letterSpacing: 0.3,
              color: page === item.id ? "#60a5fa" : "#475569"
            }}>
              {item.label}
            </span>
            {page === item.id && (
              <div style={{
                position: "absolute", bottom: 0,
                width: 32, height: 2,
                background: "#3b82f6",
                borderRadius: "2px 2px 0 0"
              }}/>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}