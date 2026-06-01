
// import { useState, useEffect } from "react";
// import { SESI_CONFIG, getSesiSaatIni, formatTanggal, formatTanggalPendek } from "../utils/index";
// import { APPS_SCRIPT_URL } from "../App";

// // ── Badge Sesi ───────────────────────────────────────────
// const SesiBadge = ({ sesi, active, onClick, count }) => (
//   <button
//     onClick={onClick}
//     style={{
//       flex: "0 0 auto",
//       padding: "8px 16px",
//       borderRadius: 100,
//       border: active
//         ? `1px solid ${sesi.warna}`
//         : "1px solid rgba(255,255,255,0.1)",
//       background: active ? sesi.warna + "22" : "transparent",
//       color: active ? sesi.warna : "#64748b",
//       fontSize: 12,
//       fontWeight: 600,
//       cursor: "pointer",
//       display: "flex",
//       alignItems: "center",
//       gap: 6,
//       whiteSpace: "nowrap",
//       transition: "all 0.2s"
//     }}
//   >
//     <span>{sesi.icon}</span>
//     <span>{sesi.label}</span>
//     {count > 0 && (
//       <span style={{
//         background: sesi.warna,
//         color: "white",
//         borderRadius: 100,
//         minWidth: 18,
//         height: 18,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontSize: 10, fontWeight: 700, padding: "0 5px"
//       }}>{count}</span>
//     )}
//   </button>
// );

// // ── Tabel Patroli (diperbaiki) ──────────────────────────
// const PatrolTable = ({ data, warnaSesi }) => {
//   const [expandRow, setExpandRow] = useState(null);

//   if (!data || data.length === 0) {
//     return (
//       <div style={{
//         textAlign: "center",
//         padding: "40px 20px",
//         background: "rgba(255,255,255,0.02)",
//         border: "1px dashed rgba(255,255,255,0.08)",
//         borderRadius: 16,
//         color: "#475569"
//       }}>
//         <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
//         <div style={{ fontSize: 14, color: "#64748b" }}>Belum ada data kontrol</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       overflowX: "auto",
//       borderRadius: 12,
//       border: "1px solid rgba(255,255,255,0.08)",
//       WebkitOverflowScrolling: "touch"
//     }}>
//       <table style={{
//         width: "100%",
//         borderCollapse: "collapse",
//         fontSize: 12,
//         minWidth: 500
//       }}>
//         {/* Head */}
//         <thead>
//           <tr style={{ background: "rgba(255,255,255,0.04)" }}>
//             {["No", "Petugas", "Jam", "Titik", "Jarak", ""].map((h, i) => (
//               <th key={i} style={{
//                 padding: "10px 12px",
//                 textAlign: i === 0 ? "center" : "left",
//                 fontSize: 10,
//                 fontWeight: 700,
//                 color: "#64748b",
//                 letterSpacing: 0.8,
//                 textTransform: "uppercase",
//                 borderBottom: "1px solid rgba(255,255,255,0.08)",
//                 whiteSpace: "nowrap"
//               }}>{h}</th>
//             ))}
//           </tr>
//         </thead>

//         {/* Body */}
//         <tbody>
//           {data.map((d, idx) => {
//             const isOpen = expandRow === idx;
//             const hasKet = d.keterangan && d.keterangan !== "Tidak ada kejadian";

//             return (
//               <>
//                 <tr
//                   onClick={() => setExpandRow(isOpen ? null : idx)}
//                   style={{
//                     background: isOpen
//                       ? "rgba(96,165,250,0.05)"
//                       : idx % 2 === 0
//                         ? "transparent"
//                         : "rgba(255,255,255,0.015)",
//                     borderLeft: isOpen
//                       ? `3px solid ${warnaSesi}`
//                       : "3px solid transparent",
//                     cursor: hasKet ? "pointer" : "default",
//                     transition: "background 0.15s, border-color 0.15s"
//                   }}
//                 >
//                   {/* No */}
//                   <td style={{
//                     padding: "10px 12px",
//                     textAlign: "center",
//                     color: "#475569",
//                     borderBottom: "1px solid rgba(255,255,255,0.05)",
//                     fontVariantNumeric: "tabular-nums"
//                   }}>{idx + 1}</td>

//                   {/* Petugas */}
//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: "1px solid rgba(255,255,255,0.05)",
//                     fontWeight: 600,
//                     color: "#f1f5f9",
//                     whiteSpace: "nowrap"
//                   }}>{d.namaPetugas}</td>

//                   {/* Jam */}
//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: "1px solid rgba(255,255,255,0.05)",
//                     color: "#94a3b8",
//                     whiteSpace: "nowrap",
//                     fontVariantNumeric: "tabular-nums"
//                   }}>{d.jam} <span style={{ fontSize: 9, color: "#475569" }}>WITA</span></td>

//                   {/* Titik */}
//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: "1px solid rgba(255,255,255,0.05)",
//                     color: "#cbd5e1",
//                     maxWidth: 180,
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap"
//                   }}>
//                     <span title={d.namaTitik}>📍 {d.namaTitik}</span>
//                   </td>

//                   {/* Jarak */}
//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: "1px solid rgba(255,255,255,0.05)",
//                     color: "#4ade80",
//                     fontWeight: 600,
//                     whiteSpace: "nowrap",
//                     fontVariantNumeric: "tabular-nums"
//                   }}>{d.jarak} m</td>

//                   {/* Expand toggle */}
//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: "1px solid rgba(255,255,255,0.05)",
//                     textAlign: "center"
//                   }}>
//                     {hasKet ? (
//                       <span style={{
//                         fontSize: 10,
//                         color: isOpen ? warnaSesi : "#64748b",
//                         transition: "color 0.15s"
//                       }}>{isOpen ? "▲" : "▼"}</span>
//                     ) : (
//                       <span style={{ color: "#1e293b", fontSize: 10 }}>—</span>
//                     )}
//                   </td>
//                 </tr>

//                 {/* Expanded: Keterangan */}
//                 {isOpen && hasKet && (
//                   <tr>
//                     <td colSpan={6} style={{
//                       padding: "0 12px 12px 12px",
//                       borderBottom: "1px solid rgba(255,255,255,0.05)",
//                       background: "rgba(96,165,250,0.03)"
//                     }}>
//                       <div style={{
//                         padding: "10px 14px",
//                         background: "rgba(251,191,36,0.08)",
//                         border: "1px solid rgba(251,191,36,0.2)",
//                         borderRadius: 8,
//                         fontSize: 12,
//                         color: "#fbbf24",
//                         lineHeight: 1.6
//                       }}>
//                         <strong>Kejadian:</strong> {d.keterangan}
//                       </div>
//                       <div style={{
//                         marginTop: 6,
//                         fontSize: 9,
//                         color: "#334155",
//                         fontFamily: "monospace"
//                       }}>{d.id}</div>
//                     </td>
//                   </tr>
//                 )}
//               </>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // ── Main Page ────────────────────────────────────────────
// export default function HariIniPage() {
//   const [sesiAktif, setSesiAktif] = useState(getSesiSaatIni());
//   const [dataMap, setDataMap]     = useState({});
//   const [loading, setLoading]     = useState(false);
//   const [error, setError]         = useState(null);
//   const [lastRefresh, setLastRefresh] = useState(null);

//   const ambilData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const tanggal = formatTanggalPendek();
//       const hasil = {};

//       // Ambil semua sesi sekaligus dari GAS
//       await Promise.all(SESI_CONFIG.map(async (s) => {
//         const url = `${APPS_SCRIPT_URL}?action=getPatrols&tanggal=${encodeURIComponent(tanggal)}&sesi=${encodeURIComponent(s.id)}`;
//         const res  = await fetch(url);
//         const json = await res.json();
//         hasil[s.id] = json.data || [];
//       }));

//       setDataMap(hasil);
//       setLastRefresh(new Date());
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Gagal memuat data. Periksa koneksi internet.");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     const initTimeout = setTimeout(() => ambilData(), 0);
//     const interval    = setInterval(ambilData, 60000);
//     return () => { clearTimeout(initTimeout); clearInterval(interval); };
//   }, []);

//   const sesiConfig = SESI_CONFIG.find(s => s.id === sesiAktif);
//   const dataSesi   = dataMap[sesiAktif] || [];

//   return (
//     <div>
//       {/* Header */}
//       <div style={{ marginBottom: 20 }}>
//         <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>
//           Laporan Hari Ini
//         </h1>
//         <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
//           {formatTanggal()}
//         </p>
//       </div>

//       {/* Ringkasan Total */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(2, 1fr)",
//         gap: 10,
//         marginBottom: 20
//       }}>
//         {SESI_CONFIG.map(s => (
//           <div
//             key={s.id}
//             onClick={() => setSesiAktif(s.id)}
//             style={{
//               background: sesiAktif === s.id ? s.warna + "18" : "rgba(255,255,255,0.03)",
//               border: `1px solid ${sesiAktif === s.id ? s.warna + "55" : s.warna + "33"}`,
//               borderRadius: 12,
//               padding: "12px 14px",
//               cursor: "pointer",
//               transition: "all 0.2s"
//             }}
//           >
//             <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
//               {s.icon} {s.label}
//             </div>
//             <div style={{ fontSize: 22, fontWeight: 700, color: s.warna }}>
//               {(dataMap[s.id] || []).length}
//             </div>
//             <div style={{ fontSize: 10, color: "#475569" }}>scan tercatat</div>
//           </div>
//         ))}
//       </div>

//       {/* Tab Sesi */}
//       <div style={{
//         display: "flex",
//         gap: 8,
//         overflowX: "auto",
//         paddingBottom: 4,
//         marginBottom: 16,
//         scrollbarWidth: "none"
//       }}>
//         {SESI_CONFIG.map(s => (
//           <SesiBadge
//             key={s.id}
//             sesi={s}
//             active={sesiAktif === s.id}
//             count={(dataMap[s.id] || []).length}
//             onClick={() => setSesiAktif(s.id)}
//           />
//         ))}
//       </div>

//       {/* Info Sesi */}
//       {sesiConfig && (
//         <div style={{
//           background: `${sesiConfig.warna}11`,
//           border: `1px solid ${sesiConfig.warna}33`,
//           borderRadius: 10,
//           padding: "10px 14px",
//           marginBottom: 16,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center"
//         }}>
//           <div>
//             <div style={{ fontSize: 12, fontWeight: 700, color: sesiConfig.warna }}>
//               {sesiConfig.icon} {sesiConfig.label}
//             </div>
//             <div style={{ fontSize: 11, color: "#64748b" }}>{sesiConfig.jam} WITA</div>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <div style={{ fontSize: 20, fontWeight: 700, color: sesiConfig.warna }}>
//               {dataSesi.length}
//             </div>
//             <div style={{ fontSize: 10, color: "#64748b" }}>total scan</div>
//           </div>
//         </div>
//       )}

//       {/* Tombol Refresh */}
//       <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
//         <button
//           onClick={ambilData}
//           disabled={loading}
//           style={{
//             background: "rgba(255,255,255,0.05)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: 8,
//             color: "#94a3b8",
//             padding: "6px 14px",
//             fontSize: 12,
//             cursor: "pointer",
//             display: "flex", alignItems: "center", gap: 6
//           }}
//         >
//           {loading ? "⏳" : "🔄"} {loading ? "Memuat..." : "Perbarui"}
//         </button>
//       </div>

//       {/* Error */}
//       {error && (
//         <div style={{
//           background: "rgba(239,68,68,0.1)",
//           border: "1px solid rgba(239,68,68,0.3)",
//           borderRadius: 10,
//           padding: 14,
//           color: "#f87171",
//           fontSize: 13,
//           marginBottom: 16
//         }}>⚠️ {error}</div>
//       )}

//       {/* Data */}
//       {loading && dataSesi.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
//           <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
//           <div>Memuat data...</div>
//         </div>
//       ) : (
//         <PatrolTable data={dataSesi} warnaSesi={sesiConfig?.warna || "#60a5fa"} />
//       )}

//       {/* Last refresh */}
//       {lastRefresh && (
//         <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#374151" }}>
//           Terakhir diperbarui: {lastRefresh.toLocaleTimeString("id-ID")}
//         </div>
//       )}
//     </div>
//   );
// }


// HariIniPage.js (disesuaikan dengan tema)
import { useState, useEffect } from "react";
import { SESI_CONFIG, getSesiSaatIni, formatTanggal, formatTanggalPendek } from "../utils/index";
import { THEMES } from "./Homepage";
import {APPS_SCRIPT_URL} from "../App";

const SesiBadge = ({ sesi, active, onClick, count, theme }) => {
  const isDark = theme === "dark";
  const T = THEMES[theme];
  
  return (
    <button
      onClick={onClick}
      style={{
        flex: "0 0 auto",
        padding: "8px 16px",
        borderRadius: 100,
        border: active
          ? `2px solid ${sesi.warna}`
          : `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#d1daf7"}`,
        background: active ? sesi.warna + "22" : isDark ? "rgba(255,255,255,0.03)" : "#f8faff",
        color: active ? sesi.warna : T.subColor,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
        transition: "all 0.2s"
      }}
    >
      <span>{sesi.icon}</span>
      <span>{sesi.label}</span>
      {count > 0 && (
        <span style={{
          background: sesi.warna,
          color: "white",
          borderRadius: 100,
          minWidth: 18,
          height: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 700, padding: "0 5px"
        }}>{count}</span>
      )}
    </button>
  );
};

const PatrolTable = ({ data, warnaSesi, theme }) => {
  const [expandRow, setExpandRow] = useState(null);
  const isDark = theme === "dark";
  const T = THEMES[theme];

  if (!data || data.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px 20px",
        background: isDark ? "rgba(255,255,255,0.02)" : "#f8faff",
        border: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "#d1daf7"}`,
        borderRadius: 16,
        color: T.subColor
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <div style={{ fontSize: 14 }}>Belum ada data kontrol</div>
      </div>
    );
  }

  return (
    <div style={{
      overflowX: "auto",
      borderRadius: 12,
      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 12,
        minWidth: 500
      }}>
        <thead>
          <tr style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9" }}>
            {["No", "Petugas", "Jam", "Titik", "Jarak", ""].map((h, i) => (
              <th key={i} style={{
                padding: "10px 12px",
                textAlign: i === 0 ? "center" : "left",
                fontSize: 10,
                fontWeight: 700,
                color: isDark ? "#64748b" : "#475569",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
                whiteSpace: "nowrap"
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => {
            const isOpen = expandRow === idx;
            const hasKet = d.keterangan && d.keterangan !== "Tidak ada kejadian";

            return (
              <>
                <tr
                  onClick={() => setExpandRow(isOpen ? null : idx)}
                  style={{
                    background: isOpen
                      ? isDark ? "rgba(96,165,250,0.08)" : "rgba(37,99,235,0.04)"
                      : idx % 2 === 0
                        ? "transparent"
                        : isDark ? "rgba(255,255,255,0.02)" : "#f8faff",
                    borderLeft: isOpen ? `3px solid ${warnaSesi}` : "3px solid transparent",
                    cursor: hasKet ? "pointer" : "default",
                    transition: "all 0.15s"
                  }}
                >
                  <td style={{
                    padding: "10px 12px",
                    textAlign: "center",
                    color: T.titleColor,
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`
                  }}>{idx + 1}</td>
                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,
                    fontWeight: 600,
                    color: T.titleColor,
                    whiteSpace: "nowrap"
                  }}>{d.namaPetugas}</td>
                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,
                    color: T.subColor,
                    whiteSpace: "nowrap"
                  }}>{d.jam} <span style={{ fontSize: 9 }}>WITA</span></td>
                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,
                    color: T.titleColor,
                    maxWidth: 180,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    <span title={d.namaTitik}>📍 {d.namaTitik}</span>
                  </td>
                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,
                    color: "#4ade80",
                    fontWeight: 600,
                    whiteSpace: "nowrap"
                  }}>{d.jarak} m</td>
                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,
                    textAlign: "center"
                  }}>
                    {hasKet ? (
                      <span style={{
                        fontSize: 10,
                        color: isOpen ? warnaSesi : T.subColor,
                      }}>{isOpen ? "▲" : "▼"}</span>
                    ) : (
                      <span style={{ color: isDark ? "#1e293b" : "#e2e8f0", fontSize: 10 }}>—</span>
                    )}
                  </td>
                 </tr>
                {isOpen && hasKet && (
                  <tr>
                    <td colSpan={6} style={{
                      padding: "0 12px 12px 12px",
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,
                      background: isDark ? "rgba(96,165,250,0.03)" : "rgba(37,99,235,0.02)"
                    }}>
                      <div style={{
                        padding: "10px 14px",
                        background: isDark ? "rgba(251,191,36,0.08)" : "rgba(245,158,11,0.08)",
                        border: `1px solid ${isDark ? "rgba(251,191,36,0.25)" : "rgba(245,158,11,0.3)"}`,
                        borderRadius: 8,
                        fontSize: 12,
                        color: isDark ? "#fbbf24" : "#b45309",
                        lineHeight: 1.6
                      }}>
                        <strong>Kejadian:</strong> {d.keterangan}
                      </div>
                      <div style={{
                        marginTop: 6,
                        fontSize: 9,
                        color: isDark ? "#334155" : "#94a3b8",
                        fontFamily: "monospace"
                      }}>{d.id}</div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default function HariIniPage({ theme = "dark" }) {
  const [sesiAktif, setSesiAktif] = useState(getSesiSaatIni());
  const [dataMap, setDataMap]     = useState({});
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const T = THEMES[theme];
  const isDark = theme === "dark";

  const ambilData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tanggal = formatTanggalPendek();
      const hasil = {};

      await Promise.all(SESI_CONFIG.map(async (s) => {
        const url = `${APPS_SCRIPT_URL}?action=getPatrols&tanggal=${encodeURIComponent(tanggal)}&sesi=${encodeURIComponent(s.id)}`;
        const res  = await fetch(url);
        const json = await res.json();
        hasil[s.id] = json.data || [];
      }));

      setDataMap(hasil);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data. Periksa koneksi internet.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const initTimeout = setTimeout(() => ambilData(), 0);
    const interval    = setInterval(ambilData, 60000);
    return () => { clearTimeout(initTimeout); clearInterval(interval); };
  }, []);

  const sesiConfig = SESI_CONFIG.find(s => s.id === sesiAktif);
  const dataSesi   = dataMap[sesiAktif] || [];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: T.titleColor }}>
          Laporan Hari Ini
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: T.subColor }}>
          {formatTanggal()}
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10,
        marginBottom: 20
      }}>
        {SESI_CONFIG.map(s => (
          <div
            key={s.id}
            onClick={() => setSesiAktif(s.id)}
            style={{
              background: sesiAktif === s.id ? s.warna + "18" : isDark ? "rgba(255,255,255,0.03)" : "#f8faff",
              border: `1px solid ${sesiAktif === s.id ? s.warna + "55" : isDark ? s.warna + "33" : s.warna + "44"}`,
              borderRadius: 12,
              padding: "12px 14px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <div style={{ fontSize: 11, color: T.subColor, marginBottom: 4 }}>
              {s.icon} {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.warna }}>
              {(dataMap[s.id] || []).length}
            </div>
            <div style={{ fontSize: 10, color: isDark ? "#475569" : "#94a3b8" }}>scan tercatat</div>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 4,
        marginBottom: 16,
      }}>
        {SESI_CONFIG.map(s => (
          <SesiBadge
            key={s.id}
            sesi={s}
            active={sesiAktif === s.id}
            count={(dataMap[s.id] || []).length}
            onClick={() => setSesiAktif(s.id)}
            theme={theme}
          />
        ))}
      </div>

      {sesiConfig && (
        <div style={{
          background: `${sesiConfig.warna}11`,
          border: `1px solid ${sesiConfig.warna}33`,
          borderRadius: 10,
          padding: "10px 14px",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: sesiConfig.warna }}>
              {sesiConfig.icon} {sesiConfig.label}
            </div>
            <div style={{ fontSize: 11, color: T.subColor }}>{sesiConfig.jam} WITA</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: sesiConfig.warna }}>
              {dataSesi.length}
            </div>
            <div style={{ fontSize: 10, color: T.subColor }}>total scan</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button
          onClick={ambilData}
          disabled={loading}
          style={{
            background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#dde5f3"}`,
            borderRadius: 8,
            color: T.subColor,
            padding: "6px 14px",
            fontSize: 12,
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6
          }}
        >
          {loading ? "⏳" : "🔄"} {loading ? "Memuat..." : "Perbarui"}
        </button>
      </div>

      {error && (
        <div style={{
          background: isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${isDark ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.3)"}`,
          borderRadius: 10,
          padding: 14,
          color: "#f87171",
          fontSize: 13,
          marginBottom: 16
        }}>⚠️ {error}</div>
      )}

      {loading && dataSesi.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: T.subColor }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div>Memuat data...</div>
        </div>
      ) : (
        <PatrolTable data={dataSesi} warnaSesi={sesiConfig?.warna || "#60a5fa"} theme={theme} />
      )}

      {lastRefresh && (
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: isDark ? "#374151" : "#94a3b8" }}>
          Terakhir diperbarui: {lastRefresh.toLocaleTimeString("id-ID")}
        </div>
      )}
    </div>
  );
}