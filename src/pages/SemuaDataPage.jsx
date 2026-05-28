// // import { useState, useEffect } from "react";
// // import { SESI_CONFIG } from "../utils/index";
// // import { APPS_SCRIPT_URL } from "../App";

// // const WARNA_SESI = Object.fromEntries(SESI_CONFIG.map(s => [s.id, s.warna]));
// // const ICON_SESI  = Object.fromEntries(SESI_CONFIG.map(s => [s.id, s.icon]));

// // // ── Filter Chip ──────────────────────────────────────────
// // const FilterChip = ({ label, active, onClick, color }) => (
// //   <button
// //     onClick={onClick}
// //     style={{
// //       padding: "6px 14px",
// //       borderRadius: 100,
// //       border: active ? `1px solid ${color || "#60a5fa"}` : "1px solid rgba(255,255,255,0.1)",
// //       background: active ? (color || "#60a5fa") + "22" : "transparent",
// //       color: active ? (color || "#60a5fa") : "#64748b",
// //       fontSize: 11,
// //       fontWeight: 600,
// //       cursor: "pointer",
// //       whiteSpace: "nowrap",
// //       transition: "all 0.15s"
// //     }}
// //   >{label}</button>
// // );

// // // ── Tabel Data ───────────────────────────────────────────
// // const DataTable = ({ data }) => {
// //   const [expandRow, setExpandRow] = useState(null);

// //   const toggleRow = (idx) => setExpandRow(expandRow === idx ? null : idx);

// //   return (
// //     <div style={{
// //       overflowX: "auto",
// //       borderRadius: 12,
// //       border: "1px solid rgba(255,255,255,0.08)",
// //       WebkitOverflowScrolling: "touch"
// //     }}>
// //       <table style={{
// //         width: "100%",
// //         borderCollapse: "collapse",
// //         fontSize: 12,
// //         minWidth: 540
// //       }}>
// //         {/* ── Head ── */}
// //         <thead>
// //           <tr style={{ background: "rgba(255,255,255,0.04)" }}>
// //             {["No", "Petugas", "Sesi", "Tanggal", "Jam", "Titik", "Jarak", ""].map((h, i) => (
// //               <th key={i} style={{
// //                 padding: "10px 12px",
// //                 textAlign: i === 0 ? "center" : "left",
// //                 fontSize: 10,
// //                 fontWeight: 700,
// //                 color: "#64748b",
// //                 letterSpacing: 0.8,
// //                 textTransform: "uppercase",
// //                 borderBottom: "1px solid rgba(255,255,255,0.08)",
// //                 whiteSpace: "nowrap"
// //               }}>{h}</th>
// //             ))}
// //           </tr>
// //         </thead>

// //         {/* ── Body ── */}
// //         <tbody>
// //           {data.map((d, idx) => {
// //             const warna  = WARNA_SESI[d.sesi] || "#60a5fa";
// //             const icon   = ICON_SESI[d.sesi]  || "📍";
// //             const isOpen = expandRow === idx;
// //             const hasKet = d.keterangan && d.keterangan !== "Tidak ada kejadian";

// //             return (
// //               <>
// //                 <tr
// //                   key={`row-${idx}`}
// //                   onClick={() => toggleRow(idx)}
// //                   style={{
// //                     background: isOpen
// //                       ? "rgba(96,165,250,0.05)"
// //                       : idx % 2 === 0
// //                         ? "transparent"
// //                         : "rgba(255,255,255,0.015)",
// //                     borderLeft: isOpen ? `3px solid ${warna}` : "3px solid transparent",
// //                     cursor: "pointer",
// //                     transition: "background 0.15s, border-color 0.15s"
// //                   }}
// //                 >
// //                   {/* No */}
// //                   <td style={{
// //                     padding: "10px 12px",
// //                     textAlign: "center",
// //                     color: "#475569",
// //                     borderBottom: "1px solid rgba(255,255,255,0.05)",
// //                     fontVariantNumeric: "tabular-nums"
// //                   }}>{idx + 1}</td>

// //                   {/* Petugas */}
// //                   <td style={{
// //                     padding: "10px 12px",
// //                     borderBottom: "1px solid rgba(255,255,255,0.05)",
// //                     fontWeight: 600,
// //                     color: "#f1f5f9",
// //                     whiteSpace: "nowrap"
// //                   }}>{d.namaPetugas}</td>

// //                   {/* Sesi */}
// //                   <td style={{
// //                     padding: "10px 12px",
// //                     borderBottom: "1px solid rgba(255,255,255,0.05)"
// //                   }}>
// //                     <span style={{
// //                       fontSize: 10,
// //                       background: warna + "22",
// //                       color: warna,
// //                       borderRadius: 6,
// //                       padding: "3px 8px",
// //                       fontWeight: 700,
// //                       whiteSpace: "nowrap"
// //                     }}>{icon} {d.sesi}</span>
// //                   </td>

// //                   {/* Tanggal */}
// //                   <td style={{
// //                     padding: "10px 12px",
// //                     borderBottom: "1px solid rgba(255,255,255,0.05)",
// //                     color: "#94a3b8",
// //                     whiteSpace: "nowrap",
// //                     fontVariantNumeric: "tabular-nums"
// //                   }}>{d.tanggal}</td>

// //                   {/* Jam */}
// //                   <td style={{
// //                     padding: "10px 12px",
// //                     borderBottom: "1px solid rgba(255,255,255,0.05)",
// //                     color: "#94a3b8",
// //                     whiteSpace: "nowrap",
// //                     fontVariantNumeric: "tabular-nums"
// //                   }}>{d.jam}</td>

// //                   {/* Titik */}
// //                   <td style={{
// //                     padding: "10px 12px",
// //                     borderBottom: "1px solid rgba(255,255,255,0.05)",
// //                     color: "#cbd5e1",
// //                     maxWidth: 140,
// //                     overflow: "hidden",
// //                     textOverflow: "ellipsis",
// //                     whiteSpace: "nowrap"
// //                   }}>
// //                     <span title={d.namaTitik}>📍 {d.namaTitik}</span>
// //                   </td>

// //                   {/* Jarak */}
// //                   <td style={{
// //                     padding: "10px 12px",
// //                     borderBottom: "1px solid rgba(255,255,255,0.05)",
// //                     color: "#4ade80",
// //                     fontWeight: 600,
// //                     whiteSpace: "nowrap",
// //                     fontVariantNumeric: "tabular-nums"
// //                   }}>{d.jarak} m</td>

// //                   {/* Expand toggle */}
// //                   <td style={{
// //                     padding: "10px 12px",
// //                     borderBottom: "1px solid rgba(255,255,255,0.05)",
// //                     textAlign: "center"
// //                   }}>
// //                     {hasKet
// //                       ? <span style={{
// //                           fontSize: 10,
// //                           display: "inline-flex",
// //                           alignItems: "center",
// //                           gap: 3,
// //                           color: isOpen ? warna : "#64748b",
// //                           transition: "color 0.15s"
// //                         }}>
// //                           {isOpen ? "▲" : "▼"}
// //                         </span>
// //                       : <span style={{ color: "#1e293b", fontSize: 10 }}>—</span>
// //                     }
// //                   </td>
// //                 </tr>

// //                 {/* ── Expanded: Keterangan ── */}
// //                 {isOpen && hasKet && (
// //                   <tr key={`exp-${idx}`}>
// //                     <td colSpan={8} style={{
// //                       padding: "0 12px 12px 12px",
// //                       borderBottom: "1px solid rgba(255,255,255,0.05)",
// //                       background: "rgba(96,165,250,0.03)"
// //                     }}>
// //                       <div style={{
// //                         padding: "10px 14px",
// //                         background: "rgba(251,191,36,0.08)",
// //                         border: "1px solid rgba(251,191,36,0.2)",
// //                         borderRadius: 8,
// //                         fontSize: 12,
// //                         color: "#fbbf24",
// //                         lineHeight: 1.6
// //                       }}>
// //                         <strong>Kejadian:</strong> {d.keterangan}
// //                       </div>
// //                       <div style={{
// //                         marginTop: 6,
// //                         fontSize: 9,
// //                         color: "#334155",
// //                         fontFamily: "monospace"
// //                       }}>{d.id}</div>
// //                     </td>
// //                   </tr>
// //                 )}
// //               </>
// //             );
// //           })}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // // ── Main Page ────────────────────────────────────────────
// // export default function SemuaDataPage() {
// //   const [semua, setSemua]             = useState([]);
// //   const [loading, setLoading]         = useState(false);
// //   const [error, setError]             = useState(null);
// //   const [filterSesi, setFilterSesi]   = useState("SEMUA");
// //   const [filterTanggal, setFilterTanggal] = useState("");
// //   const [cari, setCari]               = useState("");
// //   const [hal, setHal]                 = useState(1);

// //   const PER_HAL = 20;

// //   const ambilData = async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const url  = `${APPS_SCRIPT_URL}?action=getAllPatrols`;
// //       const res  = await fetch(url);
// //       const json = await res.json();
// //       setSemua(json.data || []);
// //     } catch {
// //       setError("Gagal memuat data.");
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     let isMounted = true;
// //     const timer = setTimeout(() => {
// //       if (!isMounted) return;
// //       ambilData();
// //     }, 0);
// //     return () => { isMounted = false; clearTimeout(timer); };
// //   }, []);

// //   // Filter
// //   const filtered = semua.filter(d => {
// //     const matchSesi    = filterSesi === "SEMUA" || d.sesi === filterSesi;
// //     const matchTanggal = !filterTanggal || d.tanggal === filterTanggal;
// //     const matchCari    = !cari || [d.namaPetugas, d.namaTitik, d.keterangan].some(
// //       v => v?.toLowerCase().includes(cari.toLowerCase())
// //     );
// //     return matchSesi && matchTanggal && matchCari;
// //   });

// //   const totalHal = Math.ceil(filtered.length / PER_HAL);
// //   const dataHal  = filtered.slice((hal - 1) * PER_HAL, hal * PER_HAL);
// //   const resetHal = () => setHal(1);

// //   // Statistik ringkas
// //   const statPerSesi = SESI_CONFIG.map(s => ({
// //     ...s,
// //     count: semua.filter(d => d.sesi === s.id).length
// //   }));

// //   return (
// //     <div>
// //       {/* Header */}
// //       <div style={{ marginBottom: 20 }}>
// //         <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>
// //           Riwayat Semua Data
// //         </h1>
// //         <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
// //           Total {semua.length} catatan kontrol
// //         </p>
// //       </div>

// //       {/* Stat bar */}
// //       <div style={{
// //         display: "flex",
// //         gap: 8,
// //         overflowX: "auto",
// //         marginBottom: 20,
// //         paddingBottom: 4,
// //         scrollbarWidth: "none"
// //       }}>
// //         {statPerSesi.map(s => (
// //           <div key={s.id} style={{
// //             flex: "0 0 auto",
// //             background: s.warna + "11",
// //             border: `1px solid ${s.warna}33`,
// //             borderRadius: 12,
// //             padding: "10px 14px",
// //             minWidth: 90,
// //             textAlign: "center"
// //           }}>
// //             <div style={{ fontSize: 18 }}>{s.icon}</div>
// //             <div style={{ fontSize: 18, fontWeight: 700, color: s.warna }}>{s.count}</div>
// //             <div style={{ fontSize: 9, color: "#64748b" }}>{s.label}</div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Search */}
// //       <div style={{ marginBottom: 12 }}>
// //         <input
// //           type="text"
// //           value={cari}
// //           onChange={e => { setCari(e.target.value); resetHal(); }}
// //           placeholder="🔍  Cari nama petugas, titik, keterangan..."
// //           style={{
// //             width: "100%",
// //             background: "rgba(255,255,255,0.05)",
// //             border: "1px solid rgba(255,255,255,0.12)",
// //             borderRadius: 10,
// //             padding: "12px 14px",
// //             color: "#f1f5f9",
// //             fontSize: 13,
// //             outline: "none",
// //             boxSizing: "border-box"
// //           }}
// //         />
// //       </div>

// //       {/* Filter Sesi */}
// //       <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 10, scrollbarWidth: "none" }}>
// //         <FilterChip
// //           label="Semua Sesi"
// //           active={filterSesi === "SEMUA"}
// //           onClick={() => { setFilterSesi("SEMUA"); resetHal(); }}
// //           color="#60a5fa"
// //         />
// //         {SESI_CONFIG.map(s => (
// //           <FilterChip
// //             key={s.id}
// //             label={`${s.icon} ${s.label}`}
// //             active={filterSesi === s.id}
// //             onClick={() => { setFilterSesi(s.id); resetHal(); }}
// //             color={s.warna}
// //           />
// //         ))}
// //       </div>

// //       {/* Filter Tanggal */}
// //       <div style={{ marginBottom: 16 }}>
// //         <input
// //           type="text"
// //           value={filterTanggal}
// //           onChange={e => { setFilterTanggal(e.target.value); resetHal(); }}
// //           placeholder="Filter tanggal (dd/mm/yyyy)"
// //           style={{
// //             width: "100%",
// //             background: "rgba(255,255,255,0.05)",
// //             border: "1px solid rgba(255,255,255,0.12)",
// //             borderRadius: 10,
// //             padding: "10px 14px",
// //             color: "#f1f5f9",
// //             fontSize: 13,
// //             outline: "none",
// //             boxSizing: "border-box"
// //           }}
// //         />
// //       </div>

// //       {/* Hasil & Refresh */}
// //       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
// //         <span style={{ fontSize: 12, color: "#64748b" }}>
// //           Menampilkan {filtered.length} data
// //         </span>
// //         <button
// //           onClick={ambilData}
// //           disabled={loading}
// //           style={{
// //             background: "rgba(255,255,255,0.05)",
// //             border: "1px solid rgba(255,255,255,0.1)",
// //             borderRadius: 8,
// //             color: "#94a3b8",
// //             padding: "6px 12px",
// //             fontSize: 11,
// //             cursor: "pointer"
// //           }}
// //         >{loading ? "⏳" : "🔄"} {loading ? "Memuat..." : "Refresh"}</button>
// //       </div>

// //       {/* Error */}
// //       {error && (
// //         <div style={{
// //           background: "rgba(239,68,68,0.1)",
// //           border: "1px solid rgba(239,68,68,0.3)",
// //           borderRadius: 10, padding: 14,
// //           color: "#f87171", fontSize: 13, marginBottom: 16
// //         }}>⚠️ {error}</div>
// //       )}

// //       {/* ── Data Table / States ── */}
// //       {loading && semua.length === 0 ? (
// //         <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
// //           <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
// //           <div>Memuat data...</div>
// //         </div>
// //       ) : filtered.length === 0 ? (
// //         <div style={{
// //           textAlign: "center", padding: "40px 20px",
// //           background: "rgba(255,255,255,0.02)",
// //           border: "1px dashed rgba(255,255,255,0.08)",
// //           borderRadius: 16, color: "#475569"
// //         }}>
// //           <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
// //           <div style={{ fontSize: 14, color: "#64748b" }}>Tidak ada data ditemukan</div>
// //         </div>
// //       ) : (
// //         <>
// //           <DataTable data={dataHal} />

// //           {/* Pagination */}
// //           {totalHal > 1 && (
// //             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
// //               <button
// //                 onClick={() => setHal(h => Math.max(1, h - 1))}
// //                 disabled={hal === 1}
// //                 style={{
// //                   background: "rgba(255,255,255,0.05)",
// //                   border: "1px solid rgba(255,255,255,0.1)",
// //                   borderRadius: 8, color: "#94a3b8",
// //                   padding: "8px 16px", fontSize: 12,
// //                   cursor: hal === 1 ? "not-allowed" : "pointer",
// //                   opacity: hal === 1 ? 0.4 : 1
// //                 }}
// //               >← Sebelumnya</button>
// //               <span style={{ padding: "8px 14px", fontSize: 12, color: "#64748b" }}>
// //                 {hal} / {totalHal}
// //               </span>
// //               <button
// //                 onClick={() => setHal(h => Math.min(totalHal, h + 1))}
// //                 disabled={hal === totalHal}
// //                 style={{
// //                   background: "rgba(255,255,255,0.05)",
// //                   border: "1px solid rgba(255,255,255,0.1)",
// //                   borderRadius: 8, color: "#94a3b8",
// //                   padding: "8px 16px", fontSize: 12,
// //                   cursor: hal === totalHal ? "not-allowed" : "pointer",
// //                   opacity: hal === totalHal ? 0.4 : 1
// //                 }}
// //               >Berikutnya →</button>
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // }



// // SemuaDataPage.js
// import React, { useState, useEffect } from "react";
// import { SESI_CONFIG } from "../utils/index";
// import { APPS_SCRIPT_URL } from "../App";

// // TEMA untuk halaman ini (fallback jika THEMES dari App tidak lengkap)
// const PAGE_THEMES = {
//   dark: {
//     titleColor: "#f1f5f9",
//     subColor: "#94a3b8",
//     cardBg: "rgba(255,255,255,0.03)",
//     cardBorder: "rgba(255,255,255,0.08)",
//     inputBg: "rgba(255,255,255,0.05)",
//     inputBorder: "rgba(255,255,255,0.12)",
//     tableHeaderBg: "rgba(255,255,255,0.04)",
//     tableBorder: "rgba(255,255,255,0.08)",
//     tableRowHover: "rgba(96,165,250,0.05)",
//     emptyBg: "rgba(255,255,255,0.02)",
//     emptyBorder: "rgba(255,255,255,0.08)",
//     buttonBg: "rgba(255,255,255,0.05)",
//     buttonBorder: "rgba(255,255,255,0.1)",
//     errorBg: "rgba(239,68,68,0.1)",
//     errorBorder: "rgba(239,68,68,0.3)",
//   },
//   light: {
//     titleColor: "#1e293b",
//     subColor: "#64748b",
//     cardBg: "#ffffff",
//     cardBorder: "#e2e8f0",
//     inputBg: "#f8faff",
//     inputBorder: "#d1daf7",
//     tableHeaderBg: "#f1f5f9",
//     tableBorder: "#e2e8f0",
//     tableRowHover: "rgba(37,99,235,0.04)",
//     emptyBg: "#f8faff",
//     emptyBorder: "#d1daf7",
//     buttonBg: "#f1f5f9",
//     buttonBorder: "#dde5f3",
//     errorBg: "rgba(239,68,68,0.08)",
//     errorBorder: "rgba(239,68,68,0.3)",
//   }
// };

// const WARNA_SESI = Object.fromEntries(SESI_CONFIG.map(s => [s.id, s.warna]));
// const ICON_SESI  = Object.fromEntries(SESI_CONFIG.map(s => [s.id, s.icon]));

// // ── Filter Chip ──────────────────────────────────────────
// const FilterChip = ({ label, active, onClick, color, theme }) => {
//   const isDark = theme === "dark";
//   const T = PAGE_THEMES[theme];
  
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         padding: "6px 14px",
//         borderRadius: 100,
//         border: active 
//           ? `2px solid ${color || "#60a5fa"}` 
//           : `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#d1daf7"}`,
//         background: active 
//           ? (color || "#60a5fa") + "22" 
//           : isDark ? "rgba(255,255,255,0.03)" : "#f8faff",
//         color: active ? (color || "#60a5fa") : T.subColor,
//         fontSize: 11,
//         fontWeight: 600,
//         cursor: "pointer",
//         whiteSpace: "nowrap",
//         transition: "all 0.15s"
//       }}
//     >{label}</button>
//   );
// };

// // ── Tabel Data ───────────────────────────────────────────
// const DataTable = ({ data, theme }) => {
//   const [expandRow, setExpandRow] = useState(null);
//   const isDark = theme === "dark";
//   const T = PAGE_THEMES[theme];

//   const toggleRow = (idx) => setExpandRow(expandRow === idx ? null : idx);

//   if (!data || data.length === 0) {
//     return (
//       <div style={{
//         textAlign: "center",
//         padding: "40px 20px",
//         background: T.emptyBg,
//         border: `1px dashed ${T.emptyBorder}`,
//         borderRadius: 16,
//         color: T.subColor
//       }}>
//         <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
//         <div style={{ fontSize: 14 }}>Tidak ada data ditemukan</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       overflowX: "auto",
//       borderRadius: 12,
//       border: `1px solid ${T.tableBorder}`,
//     }}>
//       <table style={{
//         width: "100%",
//         borderCollapse: "collapse",
//         fontSize: 12,
//         minWidth: 540
//       }}>
//         <thead>
//           <tr style={{ background: T.tableHeaderBg }}>
//             {["No", "Petugas", "Sesi", "Tanggal", "Jam", "Titik", "Jarak", ""].map((h, i) => (
//               <th key={i} style={{
//                 padding: "10px 12px",
//                 textAlign: i === 0 ? "center" : "left",
//                 fontSize: 10,
//                 fontWeight: 700,
//                 color: isDark ? "#64748b" : "#475569",
//                 letterSpacing: 0.8,
//                 textTransform: "uppercase",
//                 borderBottom: `1px solid ${T.tableBorder}`,
//                 whiteSpace: "nowrap"
//               }}>{h}</th>
//             ))}
            
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((d, idx) => {
//             const warna  = WARNA_SESI[d.sesi] || "#60a5fa";
//             const icon   = ICON_SESI[d.sesi]  || "📍";
//             const isOpen = expandRow === idx;
//             const hasKet = d.keterangan && d.keterangan !== "Tidak ada kejadian";

//             return (
//               <>
//                 <tr
//                   onClick={() => hasKet && toggleRow(idx)}
//                   style={{
//                     background: isOpen
//                       ? T.tableRowHover
//                       : idx % 2 === 0
//                         ? "transparent"
//                         : isDark ? "rgba(255,255,255,0.02)" : "#f8faff",
//                     borderLeft: isOpen ? `3px solid ${warna}` : "3px solid transparent",
//                     cursor: hasKet ? "pointer" : "default",
//                     transition: "all 0.15s"
//                   }}
//                 >
//                   <td style={{
//                     padding: "10px 12px",
//                     textAlign: "center",
//                     color: T.titleColor,
//                     borderBottom: `1px solid ${T.tableBorder}`,
//                     fontVariantNumeric: "tabular-nums"
//                   }}>{idx + 1}</td>

//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: `1px solid ${T.tableBorder}`,
//                     fontWeight: 600,
//                     color: T.titleColor,
//                     whiteSpace: "nowrap"
//                   }}>{d.namaPetugas}</td>

//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: `1px solid ${T.tableBorder}`
//                   }}>
//                     <span style={{
//                       fontSize: 10,
//                       background: warna + "22",
//                       color: warna,
//                       borderRadius: 6,
//                       padding: "3px 8px",
//                       fontWeight: 700,
//                       whiteSpace: "nowrap"
//                     }}>{icon} {d.sesi}</span>
//                   </td>

//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: `1px solid ${T.tableBorder}`,
//                     color: T.subColor,
//                     whiteSpace: "nowrap",
//                     fontVariantNumeric: "tabular-nums"
//                   }}>{d.tanggal}</td>

//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: `1px solid ${T.tableBorder}`,
//                     color: T.subColor,
//                     whiteSpace: "nowrap",
//                     fontVariantNumeric: "tabular-nums"
//                   }}>{d.jam}</td>

//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: `1px solid ${T.tableBorder}`,
//                     color: T.titleColor,
//                     maxWidth: 140,
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap"
//                   }}>
//                     <span title={d.namaTitik}>📍 {d.namaTitik}</span>
//                   </td>

//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: `1px solid ${T.tableBorder}`,
//                     color: "#4ade80",
//                     fontWeight: 600,
//                     whiteSpace: "nowrap",
//                     fontVariantNumeric: "tabular-nums"
//                   }}>{d.jarak} m</td>

//                   <td style={{
//                     padding: "10px 12px",
//                     borderBottom: `1px solid ${T.tableBorder}`,
//                     textAlign: "center"
//                   }}>
//                     {hasKet
//                       ? <span style={{
//                           fontSize: 10,
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: 3,
//                           color: isOpen ? warna : T.subColor,
//                           transition: "color 0.15s"
//                         }}>
//                           {isOpen ? "▲" : "▼"}
//                         </span>
//                       : <span style={{ color: isDark ? "#1e293b" : "#e2e8f0", fontSize: 10 }}>—</span>
//                     }
//                   </td>
//                 </tr>

//                 {isOpen && hasKet && (
//                   <tr key={`exp-${idx}`}>
//                     <td colSpan={8} style={{
//                       padding: "0 12px 12px 12px",
//                       borderBottom: `1px solid ${T.tableBorder}`,
//                       background: isDark ? "rgba(96,165,250,0.03)" : "rgba(37,99,235,0.02)"
//                     }}>
//                       <div style={{
//                         padding: "10px 14px",
//                         background: isDark ? "rgba(251,191,36,0.08)" : "rgba(245,158,11,0.08)",
//                         border: `1px solid ${isDark ? "rgba(251,191,36,0.25)" : "rgba(245,158,11,0.3)"}`,
//                         borderRadius: 8,
//                         fontSize: 12,
//                         color: isDark ? "#fbbf24" : "#b45309",
//                         lineHeight: 1.6
//                       }}>
//                         <strong>Kejadian:</strong> {d.keterangan}
//                       </div>
//                       <div style={{
//                         marginTop: 6,
//                         fontSize: 9,
//                         color: isDark ? "#334155" : "#94a3b8",
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
// export default function SemuaDataPage({ theme = "dark" }) {
//   const [semua, setSemua]             = useState([]);
//   const [loading, setLoading]         = useState(false);
//   const [error, setError]             = useState(null);
//   const [filterSesi, setFilterSesi]   = useState("SEMUA");
//   const [filterTanggal, setFilterTanggal] = useState("");
//   const [cari, setCari]               = useState("");
//   const [hal, setHal]                 = useState(1);

//   const PER_HAL = 20;
//   const T = PAGE_THEMES[theme];
//   const isDark = theme === "dark";

//   const ambilData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const url  = `${APPS_SCRIPT_URL}?action=getAllPatrols`;
//       const res  = await fetch(url);
//       const json = await res.json();
//       setSemua(json.data || []);
//     } catch {
//       setError("Gagal memuat data.");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     let isMounted = true;
//     const timer = setTimeout(() => {
//       if (!isMounted) return;
//       ambilData();
//     }, 0);
//     return () => { isMounted = false; clearTimeout(timer); };
//   }, []);

//   const filtered = semua.filter(d => {
//     const matchSesi    = filterSesi === "SEMUA" || d.sesi === filterSesi;
//     const matchTanggal = !filterTanggal || d.tanggal === filterTanggal;
//     const matchCari    = !cari || [d.namaPetugas, d.namaTitik, d.keterangan].some(
//       v => v?.toLowerCase().includes(cari.toLowerCase())
//     );
//     return matchSesi && matchTanggal && matchCari;
//   });

//   const totalHal = Math.ceil(filtered.length / PER_HAL);
//   const dataHal  = filtered.slice((hal - 1) * PER_HAL, hal * PER_HAL);
//   const resetHal = () => setHal(1);

//   const statPerSesi = SESI_CONFIG.map(s => ({
//     ...s,
//     count: semua.filter(d => d.sesi === s.id).length
//   }));

//   return (
//     <div>
//       <div style={{ marginBottom: 20 }}>
//         <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: T.titleColor }}>
//           Riwayat Semua Data
//         </h1>
//         <p style={{ margin: "4px 0 0", fontSize: 13, color: T.subColor }}>
//           Total {semua.length} catatan kontrol
//         </p>
//       </div>

//       <div style={{
//         display: "flex",
//         gap: 8,
//         overflowX: "auto",
//         marginBottom: 20,
//         paddingBottom: 4,
//       }}>
//         {statPerSesi.map(s => (
//           <div key={s.id} style={{
//             flex: "0 0 auto",
//             background: s.warna + "11",
//             border: `1px solid ${s.warna}33`,
//             borderRadius: 12,
//             padding: "10px 14px",
//             minWidth: 90,
//             textAlign: "center"
//           }}>
//             <div style={{ fontSize: 18 }}>{s.icon}</div>
//             <div style={{ fontSize: 18, fontWeight: 700, color: s.warna }}>{s.count}</div>
//             <div style={{ fontSize: 9, color: T.subColor }}>{s.label}</div>
//           </div>
//         ))}
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <input
//           type="text"
//           value={cari}
//           onChange={e => { setCari(e.target.value); resetHal(); }}
//           placeholder="🔍 Cari nama petugas, titik, keterangan..."
//           style={{
//             width: "100%",
//             background: T.inputBg,
//             border: `1px solid ${T.inputBorder}`,
//             borderRadius: 10,
//             padding: "12px 14px",
//             color: T.titleColor,
//             fontSize: 13,
//             outline: "none",
//             boxSizing: "border-box"
//           }}
//         />
//       </div>

//       <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 10 }}>
//         <FilterChip
//           label="Semua Sesi"
//           active={filterSesi === "SEMUA"}
//           onClick={() => { setFilterSesi("SEMUA"); resetHal(); }}
//           color="#60a5fa"
//           theme={theme}
//         />
//         {SESI_CONFIG.map(s => (
//           <FilterChip
//             key={s.id}
//             label={`${s.icon} ${s.label}`}
//             active={filterSesi === s.id}
//             onClick={() => { setFilterSesi(s.id); resetHal(); }}
//             color={s.warna}
//             theme={theme}
//           />
//         ))}
//       </div>

//       <div style={{ marginBottom: 16 }}>
//         <input
//           type="text"
//           value={filterTanggal}
//           onChange={e => { setFilterTanggal(e.target.value); resetHal(); }}
//           placeholder="Filter tanggal (dd/mm/yyyy)"
//           style={{
//             width: "100%",
//             background: T.inputBg,
//             border: `1px solid ${T.inputBorder}`,
//             borderRadius: 10,
//             padding: "10px 14px",
//             color: T.titleColor,
//             fontSize: 13,
//             outline: "none",
//             boxSizing: "border-box"
//           }}
//         />
//       </div>

//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
//         <span style={{ fontSize: 12, color: T.subColor }}>
//           Menampilkan {filtered.length} data
//         </span>
//         <button
//           onClick={ambilData}
//           disabled={loading}
//           style={{
//             background: T.buttonBg,
//             border: `1px solid ${T.buttonBorder}`,
//             borderRadius: 8,
//             color: T.subColor,
//             padding: "6px 12px",
//             fontSize: 11,
//             cursor: "pointer"
//           }}
//         >{loading ? "⏳" : "🔄"} {loading ? "Memuat..." : "Refresh"}</button>
//       </div>

//       {error && (
//         <div style={{
//           background: T.errorBg,
//           border: `1px solid ${T.errorBorder}`,
//           borderRadius: 10,
//           padding: 14,
//           color: "#f87171",
//           fontSize: 13,
//           marginBottom: 16
//         }}>⚠️ {error}</div>
//       )}

//       {loading && semua.length === 0 ? (
//         <div style={{ textAlign: "center", padding: "40px 0", color: T.subColor }}>
//           <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
//           <div>Memuat data...</div>
//         </div>
//       ) : (
//         <DataTable data={dataHal} theme={theme} />
//       )}

//       {totalHal > 1 && !loading && filtered.length > 0 && (
//         <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
//           <button
//             onClick={() => setHal(h => Math.max(1, h - 1))}
//             disabled={hal === 1}
//             style={{
//               background: T.buttonBg,
//               border: `1px solid ${T.buttonBorder}`,
//               borderRadius: 8,
//               color: T.subColor,
//               padding: "8px 16px",
//               fontSize: 12,
//               cursor: hal === 1 ? "not-allowed" : "pointer",
//               opacity: hal === 1 ? 0.4 : 1
//             }}
//           >← Sebelumnya</button>
//           <span style={{ padding: "8px 14px", fontSize: 12, color: T.subColor }}>
//             {hal} / {totalHal}
//           </span>
//           <button
//             onClick={() => setHal(h => Math.min(totalHal, h + 1))}
//             disabled={hal === totalHal}
//             style={{
//               background: T.buttonBg,
//               border: `1px solid ${T.buttonBorder}`,
//               borderRadius: 8,
//               color: T.subColor,
//               padding: "8px 16px",
//               fontSize: 12,
//               cursor: hal === totalHal ? "not-allowed" : "pointer",
//               opacity: hal === totalHal ? 0.4 : 1
//             }}
//           >Berikutnya →</button>
//         </div>
//       )}
//     </div>
//   );
// }


// SemuaDataPage.js
import React, { useState, useEffect, useMemo } from "react";
import { SESI_CONFIG } from "../utils/index";
import { APPS_SCRIPT_URL } from "../App";

// TEMA untuk halaman ini (fallback jika THEMES dari App tidak lengkap)
const PAGE_THEMES = {
  dark: {
    titleColor: "#f1f5f9",
    subColor: "#94a3b8",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(255,255,255,0.08)",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.12)",
    tableHeaderBg: "rgba(255,255,255,0.04)",
    tableBorder: "rgba(255,255,255,0.08)",
    tableRowHover: "rgba(96,165,250,0.05)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyBorder: "rgba(255,255,255,0.08)",
    buttonBg: "rgba(255,255,255,0.05)",
    buttonBorder: "rgba(255,255,255,0.1)",
    errorBg: "rgba(239,68,68,0.1)",
    errorBorder: "rgba(239,68,68,0.3)",
    selectBg: "rgba(255,255,255,0.05)",
  },
  light: {
    titleColor: "#1e293b",
    subColor: "#64748b",
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    inputBg: "#f8faff",
    inputBorder: "#d1daf7",
    tableHeaderBg: "#f1f5f9",
    tableBorder: "#e2e8f0",
    tableRowHover: "rgba(37,99,235,0.04)",
    emptyBg: "#f8faff",
    emptyBorder: "#d1daf7",
    buttonBg: "#f1f5f9",
    buttonBorder: "#dde5f3",
    errorBg: "rgba(239,68,68,0.08)",
    errorBorder: "rgba(239,68,68,0.3)",
    selectBg: "#f8faff",
  }
};

const WARNA_SESI = Object.fromEntries(SESI_CONFIG.map(s => [s.id, s.warna]));
const ICON_SESI  = Object.fromEntries(SESI_CONFIG.map(s => [s.id, s.icon]));

// ── Filter Chip ──────────────────────────────────────────
const FilterChip = ({ label, active, onClick, color, theme }) => {
  const isDark = theme === "dark";
  const T = PAGE_THEMES[theme];
  
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 100,
        border: active 
          ? `2px solid ${color || "#60a5fa"}` 
          : `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#d1daf7"}`,
        background: active 
          ? (color || "#60a5fa") + "22" 
          : isDark ? "rgba(255,255,255,0.03)" : "#f8faff",
        color: active ? (color || "#60a5fa") : T.subColor,
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.15s"
      }}
    >{label}</button>
  );
};

// ── Custom Select Dropdown ─────────────────────────────────
const CustomSelect = ({ value, onChange, options, placeholder, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const T = PAGE_THEMES[theme];
  const isDark = theme === "dark";

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          background: T.selectBg,
          border: `1px solid ${T.inputBorder}`,
          borderRadius: 10,
          padding: "10px 14px",
          color: value ? T.titleColor : T.subColor,
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box"
        }}
      >
        <span>{value || placeholder}</span>
        <span style={{ fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
      </div>
      
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998
            }}
          />
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            background: isDark ? "#1e293b" : "#ffffff",
            border: `1px solid ${T.inputBorder}`,
            borderRadius: 10,
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 999,
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
          }}>
            <div
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                color: T.subColor,
                fontSize: 13,
                borderBottom: `1px solid ${T.inputBorder}`,
                background: !value ? (isDark ? "rgba(96,165,250,0.1)" : "#eff6ff") : "transparent"
              }}
            >
              Semua Tanggal
            </div>
            {options.map(opt => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  color: T.titleColor,
                  fontSize: 13,
                  borderBottom: `1px solid ${T.inputBorder}`,
                  background: value === opt ? (isDark ? "rgba(96,165,250,0.1)" : "#eff6ff") : "transparent"
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Tabel Data ───────────────────────────────────────────
const DataTable = ({ data, theme }) => {
  const [expandRow, setExpandRow] = useState(null);
  const isDark = theme === "dark";
  const T = PAGE_THEMES[theme];

  const toggleRow = (idx) => setExpandRow(expandRow === idx ? null : idx);

  if (!data || data.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px 20px",
        background: T.emptyBg,
        border: `1px dashed ${T.emptyBorder}`,
        borderRadius: 16,
        color: T.subColor
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
        <div style={{ fontSize: 14 }}>Tidak ada data ditemukan</div>
      </div>
    );
  }

  return (
    <div style={{
      overflowX: "auto",
      borderRadius: 12,
      border: `1px solid ${T.tableBorder}`,
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 12,
        minWidth: 540
      }}>
        <thead>
          <tr style={{ background: T.tableHeaderBg }}>
            {["No", "Petugas", "Sesi", "Tanggal", "Jam", "Titik", "Jarak", ""].map((h, i) => (
              <th key={i} style={{
                padding: "10px 12px",
                textAlign: i === 0 ? "center" : "left",
                fontSize: 10,
                fontWeight: 700,
                color: isDark ? "#64748b" : "#475569",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                borderBottom: `1px solid ${T.tableBorder}`,
                whiteSpace: "nowrap"
              }}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((d, idx) => {
            const warna  = WARNA_SESI[d.sesi] || "#60a5fa";
            const icon   = ICON_SESI[d.sesi]  || "📍";
            const isOpen = expandRow === idx;
            const hasKet = d.keterangan && d.keterangan !== "Tidak ada kejadian";

            return (
              <React.Fragment key={idx}>
                <tr
                  onClick={() => hasKet && toggleRow(idx)}
                  style={{
                    background: isOpen
                      ? T.tableRowHover
                      : idx % 2 === 0
                        ? "transparent"
                        : isDark ? "rgba(255,255,255,0.02)" : "#f8faff",
                    borderLeft: isOpen ? `3px solid ${warna}` : "3px solid transparent",
                    cursor: hasKet ? "pointer" : "default",
                    transition: "all 0.15s"
                  }}
                >
                  <td style={{
                    padding: "10px 12px",
                    textAlign: "center",
                    color: T.titleColor,
                    borderBottom: `1px solid ${T.tableBorder}`,
                    fontVariantNumeric: "tabular-nums"
                  }}>{idx + 1}</td>

                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${T.tableBorder}`,
                    fontWeight: 600,
                    color: T.titleColor,
                    whiteSpace: "nowrap"
                  }}>{d.namaPetugas}</td>

                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${T.tableBorder}`
                  }}>
                    <span style={{
                      fontSize: 10,
                      background: warna + "22",
                      color: warna,
                      borderRadius: 6,
                      padding: "3px 8px",
                      fontWeight: 700,
                      whiteSpace: "nowrap"
                    }}>{icon} {d.sesi}</span>
                  </td>

                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${T.tableBorder}`,
                    color: T.subColor,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums"
                  }}>{d.tanggal}</td>

                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${T.tableBorder}`,
                    color: T.subColor,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums"
                  }}>{d.jam}</td>

                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${T.tableBorder}`,
                    color: T.titleColor,
                    maxWidth: 140,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    <span title={d.namaTitik}>📍 {d.namaTitik}</span>
                  </td>

                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${T.tableBorder}`,
                    color: "#4ade80",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums"
                  }}>{d.jarak} m</td>

                  <td style={{
                    padding: "10px 12px",
                    borderBottom: `1px solid ${T.tableBorder}`,
                    textAlign: "center"
                  }}>
                    {hasKet
                      ? <span style={{
                          fontSize: 10,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                          color: isOpen ? warna : T.subColor,
                          transition: "color 0.15s"
                        }}>
                          {isOpen ? "▲" : "▼"}
                        </span>
                      : <span style={{ color: isDark ? "#1e293b" : "#e2e8f0", fontSize: 10 }}>—</span>
                    }
                  </td>
                </tr>

                {isOpen && hasKet && (
                  <tr key={`exp-${idx}`}>
                    <td colSpan={8} style={{
                      padding: "0 12px 12px 12px",
                      borderBottom: `1px solid ${T.tableBorder}`,
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
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────
export default function SemuaDataPage({ theme = "dark" }) {
  const [semua, setSemua]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [filterSesi, setFilterSesi]   = useState("SEMUA");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [cari, setCari]               = useState("");
  const [hal, setHal]                 = useState(1);

  const PER_HAL = 20;
  const T = PAGE_THEMES[theme];
  const isDark = theme === "dark";

  const ambilData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url  = `${APPS_SCRIPT_URL}?action=getAllPatrols`;
      const res  = await fetch(url);
      const json = await res.json();
      setSemua(json.data || []);
    } catch {
      setError("Gagal memuat data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (!isMounted) return;
      ambilData();
    }, 0);
    return () => { isMounted = false; clearTimeout(timer); };
  }, []);

  // Get unique dates from data (sorted descending)
  const uniqueDates = useMemo(() => {
    const dates = [...new Set(semua.map(d => d.tanggal).filter(t => t))];
    return dates.sort((a, b) => {
      // Parse dd/mm/yyyy to Date for comparison
      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(year, month - 1, day);
      };
      return parseDate(b) - parseDate(a);
    });
  }, [semua]);

  const filtered = semua.filter(d => {
    const matchSesi    = filterSesi === "SEMUA" || d.sesi === filterSesi;
    const matchTanggal = !filterTanggal || d.tanggal === filterTanggal;
    const matchCari    = !cari || [d.namaPetugas, d.namaTitik, d.keterangan].some(
      v => v?.toLowerCase().includes(cari.toLowerCase())
    );
    return matchSesi && matchTanggal && matchCari;
  });

  const totalHal = Math.ceil(filtered.length / PER_HAL);
  const dataHal  = filtered.slice((hal - 1) * PER_HAL, hal * PER_HAL);
  const resetHal = () => setHal(1);

  const statPerSesi = SESI_CONFIG.map(s => ({
    ...s,
    count: semua.filter(d => d.sesi === s.id).length
  }));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: T.titleColor }}>
          Riwayat Semua Data
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: T.subColor }}>
          Total {semua.length} catatan kontrol
        </p>
      </div>

      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        marginBottom: 20,
        paddingBottom: 4,
      }}>
        {statPerSesi.map(s => (
          <div key={s.id} style={{
            flex: "0 0 auto",
            background: s.warna + "11",
            border: `1px solid ${s.warna}33`,
            borderRadius: 12,
            padding: "10px 14px",
            minWidth: 90,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.warna }}>{s.count}</div>
            <div style={{ fontSize: 9, color: T.subColor }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={cari}
          onChange={e => { setCari(e.target.value); resetHal(); }}
          placeholder="🔍 Cari nama petugas, titik, keterangan..."
          style={{
            width: "100%",
            background: T.inputBg,
            border: `1px solid ${T.inputBorder}`,
            borderRadius: 10,
            padding: "12px 14px",
            color: T.titleColor,
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 10 }}>
        <FilterChip
          label="Semua Sesi"
          active={filterSesi === "SEMUA"}
          onClick={() => { setFilterSesi("SEMUA"); resetHal(); }}
          color="#60a5fa"
          theme={theme}
        />
        {SESI_CONFIG.map(s => (
          <FilterChip
            key={s.id}
            label={`${s.icon} ${s.label}`}
            active={filterSesi === s.id}
            onClick={() => { setFilterSesi(s.id); resetHal(); }}
            color={s.warna}
            theme={theme}
          />
        ))}
      </div>

      {/* Filter Tanggal - Menggunakan Custom Select */}
      <div style={{ marginBottom: 16 }}>
        <CustomSelect
          value={filterTanggal}
          onChange={(date) => { setFilterTanggal(date); resetHal(); }}
          options={uniqueDates}
          placeholder="Pilih tanggal..."
          theme={theme}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: T.subColor }}>
          Menampilkan {filtered.length} data
        </span>
        <button
          onClick={ambilData}
          disabled={loading}
          style={{
            background: T.buttonBg,
            border: `1px solid ${T.buttonBorder}`,
            borderRadius: 8,
            color: T.subColor,
            padding: "6px 12px",
            fontSize: 11,
            cursor: "pointer"
          }}
        >{loading ? "⏳" : "🔄"} {loading ? "Memuat..." : "Refresh"}</button>
      </div>

      {error && (
        <div style={{
          background: T.errorBg,
          border: `1px solid ${T.errorBorder}`,
          borderRadius: 10,
          padding: 14,
          color: "#f87171",
          fontSize: 13,
          marginBottom: 16
        }}>⚠️ {error}</div>
      )}

      {loading && semua.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: T.subColor }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div>Memuat data...</div>
        </div>
      ) : (
        <DataTable data={dataHal} theme={theme} />
      )}

      {totalHal > 1 && !loading && filtered.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <button
            onClick={() => setHal(h => Math.max(1, h - 1))}
            disabled={hal === 1}
            style={{
              background: T.buttonBg,
              border: `1px solid ${T.buttonBorder}`,
              borderRadius: 8,
              color: T.subColor,
              padding: "8px 16px",
              fontSize: 12,
              cursor: hal === 1 ? "not-allowed" : "pointer",
              opacity: hal === 1 ? 0.4 : 1
            }}
          >← Sebelumnya</button>
          <span style={{ padding: "8px 14px", fontSize: 12, color: T.subColor }}>
            {hal} / {totalHal}
          </span>
          <button
            onClick={() => setHal(h => Math.min(totalHal, h + 1))}
            disabled={hal === totalHal}
            style={{
              background: T.buttonBg,
              border: `1px solid ${T.buttonBorder}`,
              borderRadius: 8,
              color: T.subColor,
              padding: "8px 16px",
              fontSize: 12,
              cursor: hal === totalHal ? "not-allowed" : "pointer",
              opacity: hal === totalHal ? 0.4 : 1
            }}
          >Berikutnya →</button>
        </div>
      )}
    </div>
  );
}