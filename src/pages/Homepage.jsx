import { useState, useEffect } from "react";
import ScanPage from "./ScanPage";
import HariIniPage from "./HariIniPage";
import SemuaDataPage from "./SemuaDataPage";
import GeneratorPage from "./GeneratorPage";
import { formatWaktu } from "../utils/index";

export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyNmaHCoo54d-OK_GxTCLJPDmhC5QDGfnsD0GY3RcBJ58Ph0JrMiDrJCecQ9Zirim5YJQ/exec";

const NAV_ITEMS = [
  { id: "scan",      label: "Scan Kontrol", icon: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" },
  { id: "hariini",  label: "Hari Ini",     icon: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" },
  { id: "semua",    label: "Semua Data",   icon: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" },
  { id: "generator",label: "Generator QR", icon: "M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8-12v8h8V3h-8zm6 6h-4V5h4v4zm-5.99 4h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-4 2h2v2h-2zm2-6h2v2h-2zm2 4h2v2h-2zm2-2h2v2h-2z" }
];

// ── Tema warna ────────────────────────────────────────────
const THEMES = {
  dark: {
    appBg:      "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
    headerBg:   "rgba(255,255,255,0.03)",
    headerBorder: "rgba(255,255,255,0.08)",
    navBg:      "rgba(15,15,26,0.95)",
    navBorder:  "rgba(255,255,255,0.08)",
    titleColor: "#f1f5f9",
    subColor:   "#94a3b8",
    clockColor: "#60a5fa",
    clockSub:   "#64748b",
    navActive:  "#60a5fa",
    navInactive:"#475569",
    navActiveBg:"rgba(59,130,246,0.08)",
    toggleBg:   "rgba(255,255,255,0.06)",
    toggleBorder:"rgba(255,255,255,0.12)",
    toggleText: "#94a3b8",
  },
  light: {
    appBg:      "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f0f7ff 100%)",
    headerBg:   "rgba(255,255,255,0.85)",
    headerBorder: "#dde5f3",
    navBg:      "rgba(255,255,255,0.97)",
    navBorder:  "#dde5f3",
    titleColor: "#1e293b",
    subColor:   "#64748b",
    clockColor: "#1d4ed8",
    clockSub:   "#94a3b8",
    navActive:  "#1d4ed8",
    navInactive:"#94a3b8",
    navActiveBg:"rgba(29,78,216,0.07)",
    toggleBg:   "#f1f5f9",
    toggleBorder:"#dde5f3",
    toggleText: "#64748b",
  }
};

export default function App() {
  const [page, setPage] = useState("scan");
  const [jam, setJam] = useState(formatWaktu());
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("sipatroli_theme") || "dark"; } catch { return "dark"; }
  });

  useEffect(() => {
    const t = setInterval(() => setJam(formatWaktu()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("sipatroli_theme", next); } catch (err) {
      console.error("Failed to save theme preference:", err);
    }
  };

  const T = THEMES[theme];
  const isDark = theme === "dark";

  return (
    <div style={{
      minHeight: "100vh",
      background: T.appBg,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: T.titleColor,
      display: "flex",
      flexDirection: "column",
      transition: "background 0.3s ease"
    }}>
      {/* ── TOP HEADER ─────────────────────────────────── */}
      <header style={{
        background: T.headerBg,
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.headerBorder}`,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "background 0.3s, border-color 0.3s"
      }}>
        {/* Logo + Judul */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(59,130,246,0.3)"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, color: T.titleColor }}>
              SIPATROLI
            </div>
            <div style={{ fontSize: 10, color: T.subColor, letterSpacing: 0.5 }}>
              Sistem Kontrol Keliling · Rutan
            </div>
          </div>
        </div>

        {/* Kanan: Jam + Toggle tema */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Jam */}
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: 17, fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              color: T.clockColor,
              letterSpacing: 1
            }}>{jam}</div>
            <div style={{ fontSize: 9, color: T.clockSub, textTransform: "uppercase", letterSpacing: 0.5 }}>
              WITA
            </div>
          </div>

          {/* Toggle Dark/Light */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            style={{
              width: 40, height: 40,
              borderRadius: 12,
              background: T.toggleBg,
              border: `1px solid ${T.toggleBorder}`,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
              transition: "all 0.2s",
              flexShrink: 0
            }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* ── CONTENT ────────────────────────────────────── */}
      <main style={{
        flex: 1,
        padding: "20px 16px 100px",
        maxWidth: 480,
        margin: "0 auto",
        width: "100%"
      }}>
        {page === "scan"      && <ScanPage      theme={theme} />}
        {page === "hariini"   && <HariIniPage   theme={theme} />}
        {page === "semua"     && <SemuaDataPage  theme={theme} />}
        {page === "generator" && <GeneratorPage  theme={theme} />}
      </main>

      {/* ── BOTTOM NAV ─────────────────────────────────── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: T.navBg,
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${T.navBorder}`,
        display: "flex",
        zIndex: 100,
        transition: "background 0.3s, border-color 0.3s"
      }}>
        {NAV_ITEMS.map(item => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                flex: 1, padding: "10px 4px 14px",
                background: active ? T.navActiveBg : "none",
                border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 4,
                transition: "all 0.2s",
                position: "relative"
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24"
                fill={active ? T.navActive : T.navInactive}
                style={{ transition: "fill 0.2s" }}>
                <path d={item.icon}/>
              </svg>
              <span style={{
                fontSize: 9,
                fontWeight: active ? 700 : 400,
                letterSpacing: 0.3,
                color: active ? T.navActive : T.navInactive,
                transition: "color 0.2s"
              }}>
                {item.label}
              </span>
              {active && (
                <div style={{
                  position: "absolute", bottom: 0,
                  width: 32, height: 2,
                  background: T.navActive,
                  borderRadius: "2px 2px 0 0",
                  transition: "background 0.2s"
                }}/>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}