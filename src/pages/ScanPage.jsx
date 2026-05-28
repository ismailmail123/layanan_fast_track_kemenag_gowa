// // // import { useState, useRef, useEffect } from "react";
// // // import { hitungJarak, dapatkanPosisi, getSesiSaatIni, formatWaktu, formatTanggalPendek } from "../utils/index";
// // // import { APPS_SCRIPT_URL } from "../App";

// // // const JARAK_MAKS = 5;
// // // let lastSubmittedData = null;

// // // // ── Decode QR ────────────────────────────────────────────
// // // const decodeBarcodeFlexibel = (rawText) => {
// // //   // Method 1: JSON langsung
// // //   try {
// // //     const p = JSON.parse(rawText);
// // //     if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
// // //       return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
// // //   } catch (err) { console.warn("Bukan JSON langsung:", err.message); }

// // //   // Method 2: Base64
// // //   try {
// // //     const decoded = atob(rawText);
// // //     try {
// // //       const p = JSON.parse(decoded);
// // //       if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
// // //         return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
// // //     } catch (err) { console.warn("Bukan JSON Base64:", err.message); }
// // //     const parts = decoded.split("|");
// // //     if (parts.length === 3) {
// // //       const lat = parseFloat(parts[1]), lng = parseFloat(parts[2]);
// // //       if (!isNaN(lat) && !isNaN(lng)) return { nama: parts[0], latitude: lat, longitude: lng };
// // //     }
// // //   } catch (err) { console.warn("Gagal mendekode Base64:", err.message); }

// // //   // Method 3: URI JSON
// // //   try {
// // //     const p = JSON.parse(decodeURIComponent(rawText));
// // //     if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
// // //       return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
// // //   } catch (err) { console.warn("Bukan JSON URI:", err.message); }

// // //   // Method 4: pipe langsung
// // //   const parts = rawText.split("|");
// // //   if (parts.length === 3) {
// // //     const lat = parseFloat(parts[1]), lng = parseFloat(parts[2]);
// // //     if (!isNaN(lat) && !isNaN(lng)) return { nama: parts[0], latitude: lat, longitude: lng };
// // //   }

// // //   return null;
// // // };

// // // // ── Generate ID lokal ────────────────────────────────────
// // // const buatId = (now) => {
// // //   const pad = (n) => String(n).padStart(2, "0");
// // //   return `PTR-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
// // // };

// // // // ── JSONP dengan guard terhadap double execution ──
// // // const simpanDataJSONP = (payload) => {
// // //   return new Promise((resolve, reject) => {
// // //     // 🔥 Cegah request yang sama dalam 5 detik
// // //     const requestKey = `${payload.namaPetugas}_${payload.namaTitik}_${payload.timestamp}`;
// // //     const now = Date.now();
    
// // //     if (lastSubmittedData && 
// // //         lastSubmittedData.key === requestKey && 
// // //         (now - lastSubmittedData.time) < 5000) {
// // //       console.warn("⚠️ Duplicate request dalam 5 detik, ignored");
// // //       reject(new Error("Duplicate request ignored"));
// // //       return;
// // //     }
    
// // //     lastSubmittedData = {
// // //       key: requestKey,
// // //       time: now
// // //     };
    
// // //     // Hapus setelah 5 detik
// // //     setTimeout(() => {
// // //       if (lastSubmittedData?.key === requestKey) {
// // //         lastSubmittedData = null;
// // //       }
// // //     }, 5000);
    
// // //     let resolved = false;
// // //     const cbName = `gasCallback_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    
// // //     const timer = setTimeout(() => {
// // //       if (!resolved) {
// // //         resolved = true;
// // //         cleanup();
// // //         reject(new Error("Timeout: GAS tidak merespons"));
// // //       }
// // //     }, 15000);
    
// // //     const cleanup = () => {
// // //       clearTimeout(timer);
// // //       delete window[cbName];
// // //       const el = document.getElementById(cbName);
// // //       if (el) el.remove();
// // //     };
    
// // //     window[cbName] = (data) => {
// // //       if (!resolved) {
// // //         resolved = true;
// // //         cleanup();
// // //         if (data && data.success) {
// // //           resolve(data);
// // //         } else {
// // //           reject(new Error(data?.message || "Gagal menyimpan data"));
// // //         }
// // //       } else {
// // //         console.warn("⚠️ Callback already executed, ignoring duplicate");
// // //       }
// // //     };
    
// // //     const params = new URLSearchParams({
// // //       action: "savePatrol",
// // //       callback: cbName,
// // //       namaPetugas: payload.namaPetugas,
// // //       keterangan: payload.keterangan,
// // //       namaTitik: payload.namaTitik,
// // //       latTitik: payload.latTitik,
// // //       lngTitik: payload.lngTitik,
// // //       latPetugas: payload.latPetugas,
// // //       lngPetugas: payload.lngPetugas,
// // //       jarak: payload.jarak,
// // //       timestamp: payload.timestamp,
// // //       status: payload.status,
// // //       _t: now
// // //     });
    
// // //     const script = document.createElement("script");
// // //     script.id = cbName;
// // //     script.src = `${APPS_SCRIPT_URL}?${params.toString()}`;
// // //     script.onerror = () => {
// // //       if (!resolved) {
// // //         resolved = true;
// // //         cleanup();
// // //         reject(new Error("Network error: Gagal terhubung ke server"));
// // //       }
// // //     };
    
// // //     document.head.appendChild(script);
// // //     console.log("📤 JSONP request dikirim");
// // //   });
// // // };

// // // // ── Komponen ─────────────────────────────────────────────
// // // const StatusChip = ({ tipe, pesan }) => {
// // //   const w = {
// // //     error:   { bg:"rgba(239,68,68,0.15)",  br:"rgba(239,68,68,0.4)",  tx:"#f87171", ic:"⚠️" },
// // //     sukses:  { bg:"rgba(34,197,94,0.15)",  br:"rgba(34,197,94,0.4)",  tx:"#4ade80", ic:"✅" },
// // //     info:    { bg:"rgba(59,130,246,0.15)", br:"rgba(59,130,246,0.4)", tx:"#60a5fa", ic:"ℹ️" },
// // //     warning: { bg:"rgba(234,179,8,0.15)",  br:"rgba(234,179,8,0.4)",  tx:"#facc15", ic:"🔴" },
// // //   }[tipe] || {};
// // //   return (
// // //     <div style={{background:w.bg,border:`1px solid ${w.br}`,borderRadius:10,padding:"12px 16px",color:w.tx,fontSize:13,fontWeight:500,display:"flex",alignItems:"flex-start",gap:10,marginTop:12}}>
// // //       <span style={{fontSize:16,flexShrink:0}}>{w.ic}</span>
// // //       <span style={{lineHeight:1.6,whiteSpace:"pre-line"}}>{pesan}</span>
// // //     </div>
// // //   );
// // // };

// // // const Input = ({ label, value, onChange, placeholder, required }) => (
// // //   <div style={{marginBottom:14}}>
// // //     <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
// // //       {label} {required && <span style={{color:"#f87171"}}>*</span>}
// // //     </label>
// // //     <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
// // //       style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box"}}
// // //       onFocus={e=>e.target.style.border="1px solid rgba(96,165,250,0.6)"}
// // //       onBlur={e=>e.target.style.border="1px solid rgba(255,255,255,0.12)"}
// // //     />
// // //   </div>
// // // );

// // // // ── Main Page────────────────────────────────────────────
// // // export default function ScanPage() {
// // //   const [nama, setNama] = useState("");
// // //   const [keterangan, setKeterangan] = useState("");
// // //   const [scanning, setScanning] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [status, setStatus] = useState(null);
// // //   const [hasilScan, setHasilScan] = useState(null);
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const lastScanTimeRef = useRef(0);

// // //   const videoRef = useRef(null);
// // //   const readerRef = useRef(null);
// // //   const posisiRef = useRef(null);

// // //   // Ambil GPS saat mount
// // //   useEffect(() => {
// // //     dapatkanPosisi()
// // //       .then(pos => { posisiRef.current = pos; })
// // //       .catch(err => console.warn("GPS gagal:", err.message));
// // //   }, []);

// // //   const stopCamera = () => {
// // //     if (readerRef.current) {
// // //       try { readerRef.current.reset(); } catch (err) { console.warn("Gagal menghentikan kamera:", err.message); }
// // //       readerRef.current = null;
// // //     }
// // //     setScanning(false);
// // //   };

// // //   const mulaiScan = async () => {
// // //     if (!nama.trim()) {
// // //       setStatus({tipe:"error", pesan:"Nama petugas wajib diisi sebelum scan."});
// // //       return;
// // //     }

// // //     // Refresh GPS setiap scan
// // //     try {
// // //       const pos = await dapatkanPosisi();
// // //       posisiRef.current = pos;
// // //     } catch (err) {
// // //       setStatus({tipe:"warning", pesan:`GPS tidak tersedia: ${err.message}\nScan tetap bisa dilakukan tapi jarak tidak terverifikasi.`});
// // //     }

// // //     setScanning(true);
// // //     setStatus(null);
// // //     setHasilScan(null);

// // //     // Tunggu video element siap
// // //     await new Promise(r => setTimeout(r, 300));

// // //     try {
// // //       const { BrowserMultiFormatReader } = await import("@zxing/library");
// // //       const reader = new BrowserMultiFormatReader();
// // //       readerRef.current = reader;

// // //       await reader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
// // //         if (result) {
// // //           prosesHasilScan(result.getText());
// // //         }
// // //       });
// // //     } catch (err) {
// // //       setStatus({tipe:"error", pesan:`Gagal membuka kamera: ${err.message}`});
// // //       setScanning(false);
// // //     }
// // //   };

// // //   const prosesHasilScan = async (rawText) => {
// // //     // 🔥 Cegah scan lebih dari 1 kali dalam 3 detik
// // //     const now = Date.now();
// // //     if (now - lastScanTimeRef.current < 3000) {
// // //       console.warn("⚠️ Scan terlalu cepat, ignore");
// // //       setStatus({
// // //         tipe: "warning", 
// // //         pesan: "Tunggu sebentar sebelum scan ulang..."
// // //       });
// // //       return;
// // //     }
// // //     lastScanTimeRef.current = now;
    
// // //     // Cegah submit ganda
// // //     if (isSubmitting) {
// // //       console.warn("⚠️ Already submitting");
// // //       return;
// // //     }
    
// // //     setIsSubmitting(true);
// // //     stopCamera();
// // //     setLoading(true);
    
// // //     try {
// // //       setStatus({tipe: "info", pesan: "🔍 Memverifikasi QR Code..."});
      
// // //       // ✅ Verifikasi QR Code
// // //       const dataTitik = decodeBarcodeFlexibel(rawText);
// // //       if (!dataTitik) {
// // //         setStatus({tipe:"error", pesan:"QR Code tidak valid!\nPastikan Anda scan QR Code resmi dari menu Generator QR."});
// // //         setLoading(false);
// // //         setIsSubmitting(false);
// // //         return;
// // //       }
      
// // //       // ✅ Cek GPS
// // //       const posisi = posisiRef.current;
// // //       if (!posisi) {
// // //         setStatus({tipe:"error", pesan:"Data GPS tidak tersedia. Tutup dan coba lagi."});
// // //         setLoading(false);
// // //         setIsSubmitting(false);
// // //         return;
// // //       }
      
// // //       // ✅ Hitung jarak
// // //       const jarak = hitungJarak(posisi.latitude, posisi.longitude, dataTitik.latitude, dataTitik.longitude);
// // //       const jarakBulat = Math.round(jarak * 10) / 10;
      
// // //       // ✅ Cek jarak maksimal
// // //       if (jarak > JARAK_MAKS) {
// // //         setStatus({tipe:"warning", pesan:`JARAK TERLALU JAUH!\n\nAnda berada ${jarakBulat} meter dari titik "${dataTitik.nama}".\nMaksimal: ${JARAK_MAKS} meter.\n\nPindah lebih dekat lalu scan ulang.`});
// // //         setLoading(false);
// // //         setIsSubmitting(false);
// // //         return;
// // //       }
      
// // //       // ✅ Siapkan payload
// // //       const timestamp = new Date();
// // //       const localId = buatId(timestamp);
// // //       const sesi = getSesiSaatIni();
// // //       const tanggal = formatTanggalPendek(timestamp);
// // //       const jam = formatWaktu(timestamp);
      
// // //       setStatus({tipe: "info", pesan: "📤 Mengirim data ke server..."});
      
// // //       const payload = {
// // //         namaPetugas: nama.trim(),
// // //         keterangan: keterangan.trim() || "Tidak ada kejadian",
// // //         namaTitik: dataTitik.nama,
// // //         latTitik: dataTitik.latitude,
// // //         lngTitik: dataTitik.longitude,
// // //         latPetugas: posisi.latitude,
// // //         lngPetugas: posisi.longitude,
// // //         jarak: jarakBulat,
// // //         timestamp: timestamp.toISOString(),
// // //         status: "VALID",
// // //       };
      
// // //       // ✅ Kirim data
// // //       const gasResponse = await simpanDataJSONP(payload);
// // //       console.log("✅ GAS response:", gasResponse);
      
// // //       // ✅ Tampilkan hasil
// // //       setHasilScan({ 
// // //         namaTitik: dataTitik.nama, 
// // //         jarak: jarakBulat, 
// // //         jam, 
// // //         tanggal, 
// // //         sesi, 
// // //         id: gasResponse.id || localId 
// // //       });
// // //       setStatus({tipe:"sukses", pesan:`Scan berhasil! Titik "${dataTitik.nama}" tercatat pada ${jam} WITA.`});
// // //       setKeterangan("");
      
// // //     } catch (err) {
// // //       console.error("❌ Gagal kirim data:", err);
// // //       setStatus({tipe:"error", pesan:`Gagal mengirim data ke server.\nError: ${err.message}\n\nPastikan URL Apps Script sudah benar dan GAS sudah di-deploy ulang.`});
// // //     } finally {
// // //       setIsSubmitting(false);
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // testing data

// // //   return (
// // //     <div>
// // //       <div style={{marginBottom:24}}>
// // //         <h1 style={{fontSize:22,fontWeight:700,margin:0,color:"#f1f5f9"}}>Kontrol Keliling</h1>
// // //         <p style={{margin:"4px 0 0",fontSize:13,color:"#64748b"}}>{getSesiSaatIni()} · {formatTanggalPendek()}</p>
// // //       </div>

// // //       <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:20,marginBottom:16}}>
// // //         <Input label="Nama Petugas" value={nama} onChange={setNama} placeholder="Masukkan nama lengkap" required />
// // //         <div>
// // //           <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
// // //             Keterangan / Kejadian
// // //           </label>
// // //           <textarea value={keterangan} onChange={e=>setKeterangan(e.target.value)}
// // //             placeholder="Tulis kejadian atau kondisi (opsional)" rows={3}
// // //             style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",lineHeight:1.5}}
// // //             onFocus={e=>e.target.style.border="1px solid rgba(96,165,250,0.6)"}
// // //             onBlur={e=>e.target.style.border="1px solid rgba(255,255,255,0.12)"}
// // //           />
// // //         </div>
// // //       </div>

// // //       {scanning && (
// // //         <div style={{position:"relative",borderRadius:16,overflow:"hidden",marginBottom:16,background:"#000",aspectRatio:"4/3"}}>
// // //           <video ref={videoRef} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} playsInline muted autoPlay />
// // //           <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
// // //             <div style={{position:"relative",width:200,height:200}}>
// // //               {[
// // //                 {top:0,left:0,borderTop:"3px solid #3b82f6",borderLeft:"3px solid #3b82f6"},
// // //                 {top:0,right:0,borderTop:"3px solid #3b82f6",borderRight:"3px solid #3b82f6"},
// // //                 {bottom:0,left:0,borderBottom:"3px solid #3b82f6",borderLeft:"3px solid #3b82f6"},
// // //                 {bottom:0,right:0,borderBottom:"3px solid #3b82f6",borderRight:"3px solid #3b82f6"},
// // //               ].map((s,i)=><div key={i} style={{position:"absolute",width:30,height:30,...s}}/>)}
// // //               <div style={{position:"absolute",left:0,right:0,height:2,background:"rgba(59,130,246,0.8)",animation:"scanline 2s linear infinite",top:0}}/>
// // //             </div>
// // //           </div>
// // //           <div style={{position:"absolute",bottom:16,left:0,right:0,textAlign:"center"}}>
// // //             <span style={{background:"rgba(0,0,0,0.6)",color:"#93c5fd",fontSize:12,padding:"6px 16px",borderRadius:20}}>
// // //               Arahkan ke QR Code patroli
// // //             </span>
// // //           </div>
// // //           <button onClick={stopCamera} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.7)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"white",padding:"6px 14px",fontSize:12,cursor:"pointer"}}>
// // //             ✕ Batal
// // //           </button>
// // //         </div>
// // //       )}

// // //       <style>{`
// // //         @keyframes scanline { 0%{top:0} 100%{top:196px} }
// // //         @keyframes spin { to{transform:rotate(360deg)} }
// // //       `}</style>

// // //       {status && <StatusChip tipe={status.tipe} pesan={status.pesan} />}

// // //       {hasilScan && (
// // //         <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:16,padding:20,marginTop:16}}>
// // //           <div style={{fontSize:11,fontWeight:700,color:"#4ade80",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>✅ Berhasil Tercatat di Spreadsheet</div>
// // //           <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
// // //             {[["Titik",hasilScan.namaTitik],["Jarak",`${hasilScan.jarak} m`],["Waktu",hasilScan.jam],["Sesi",hasilScan.sesi]].map(([k,v])=>(
// // //               <div key={k} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px"}}>
// // //                 <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{k}</div>
// // //                 <div style={{fontSize:14,fontWeight:600,color:"#e2e8f0"}}>{v}</div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //           <div style={{fontSize:10,color:"#475569",marginTop:12,textAlign:"center",fontFamily:"monospace"}}>{hasilScan.id}</div>
// // //         </div>
// // //       )}

// // //       {!scanning && (
// // //         <button onClick={mulaiScan} disabled={loading}
// // //           style={{width:"100%",marginTop:20,padding:"16px",background:loading?"rgba(59,130,246,0.3)":"linear-gradient(135deg,#2563eb,#7c3aed)",border:"none",borderRadius:14,color:"white",fontSize:16,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:loading?"none":"0 4px 24px rgba(37,99,235,0.4)",fontFamily:"inherit"}}>
// // //           {loading ? (
// // //             <span style={{display:"flex",alignItems:"center",gap:8}}>
// // //               <span style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}}/>
// // //               Memproses...
// // //             </span>
// // //           ) : (
// // //             <>
// // //               <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
// // //                 <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M22 5h-6v6h6V5zm-6 8h1.5v1.5H16V13zm1.5 1.5H19V16h-1.5v-1.5zM19 13h1.5v1.5H19V13zm-3 3h1.5v1.5H16V16zm1.5 1.5H19V19h-1.5v-1.5zM19 16h1.5v1.5H19V16zm1.5-1.5H22V16h-1.5v-1.5zm0 3H22V19h-1.5v-1.5z"/>
// // //               </svg>
// // //               SCAN QR CODE PATROLI
// // //             </>
// // //           )}
// // //         </button>
// // //       )}

// // //       <div style={{marginTop:16,padding:"12px 16px",background:"rgba(255,255,255,0.02)",borderRadius:10,display:"flex",alignItems:"center",gap:10}}>
// // //         <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
// // //         <span style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>
// // //           Maksimal jarak scan: <strong style={{color:"#94a3b8"}}>{JARAK_MAKS} meter</strong> dari titik QR Code.
// // //         </span>
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // import { useState, useRef, useEffect } from "react";
// // import { hitungJarak, dapatkanPosisi, getSesiSaatIni, formatWaktu, formatTanggalPendek } from "../utils/index";
// // import { APPS_SCRIPT_URL } from "../App";

// // const JARAK_MAKS = 25;
// // let lastSubmittedData = null;

// // // ── Decode QR ────────────────────────────────────────────
// // const decodeBarcodeFlexibel = (rawText) => {
// //   // Method 1: JSON langsung
// //   try {
// //     const p = JSON.parse(rawText);
// //     if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
// //       return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
// //   } catch (err) { console.warn("Bukan JSON langsung:", err.message); }

// //   // Method 2: Base64
// //   try {
// //     const decoded = atob(rawText);
// //     try {
// //       const p = JSON.parse(decoded);
// //       if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
// //         return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
// //     } catch (err) { console.warn("Bukan JSON Base64:", err.message); }
// //     const parts = decoded.split("|");
// //     if (parts.length === 3) {
// //       const lat = parseFloat(parts[1]), lng = parseFloat(parts[2]);
// //       if (!isNaN(lat) && !isNaN(lng)) return { nama: parts[0], latitude: lat, longitude: lng };
// //     }
// //   } catch (err) { console.warn("Gagal mendekode Base64:", err.message); }

// //   // Method 3: URI JSON
// //   try {
// //     const p = JSON.parse(decodeURIComponent(rawText));
// //     if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
// //       return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
// //   } catch (err) { console.warn("Bukan JSON URI:", err.message); }

// //   // Method 4: pipe langsung
// //   const parts = rawText.split("|");
// //   if (parts.length === 3) {
// //     const lat = parseFloat(parts[1]), lng = parseFloat(parts[2]);
// //     if (!isNaN(lat) && !isNaN(lng)) return { nama: parts[0], latitude: lat, longitude: lng };
// //   }

// //   return null;
// // };

// // // ── Generate ID lokal ────────────────────────────────────
// // const buatId = (now) => {
// //   const pad = (n) => String(n).padStart(2, "0");
// //   return `PTR-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
// // };

// // // ── JSONP dengan guard terhadap double execution ──
// // const simpanDataJSONP = (payload) => {
// //   return new Promise((resolve, reject) => {
// //     // 🔥 Cegah request yang sama dalam 5 detik
// //     const requestKey = `${payload.namaPetugas}_${payload.namaTitik}_${payload.timestamp}`;
// //     const now = Date.now();
    
// //     if (lastSubmittedData && 
// //         lastSubmittedData.key === requestKey && 
// //         (now - lastSubmittedData.time) < 5000) {
// //       console.warn("⚠️ Duplicate request dalam 5 detik, ignored");
// //       reject(new Error("Duplicate request ignored"));
// //       return;
// //     }
    
// //     lastSubmittedData = {
// //       key: requestKey,
// //       time: now
// //     };
    
// //     // Hapus setelah 5 detik
// //     setTimeout(() => {
// //       if (lastSubmittedData?.key === requestKey) {
// //         lastSubmittedData = null;
// //       }
// //     }, 5000);
    
// //     let resolved = false;
// //     const cbName = `gasCallback_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    
// //     const timer = setTimeout(() => {
// //       if (!resolved) {
// //         resolved = true;
// //         cleanup();
// //         reject(new Error("Timeout: GAS tidak merespons"));
// //       }
// //     }, 15000);
    
// //     const cleanup = () => {
// //       clearTimeout(timer);
// //       delete window[cbName];
// //       const el = document.getElementById(cbName);
// //       if (el) el.remove();
// //     };
    
// //     window[cbName] = (data) => {
// //       if (!resolved) {
// //         resolved = true;
// //         cleanup();
// //         if (data && data.success) {
// //           resolve(data);
// //         } else {
// //           reject(new Error(data?.message || "Gagal menyimpan data"));
// //         }
// //       } else {
// //         console.warn("⚠️ Callback already executed, ignoring duplicate");
// //       }
// //     };
    
// //     const params = new URLSearchParams({
// //       action: "savePatrol",
// //       callback: cbName,
// //       namaPetugas: payload.namaPetugas,
// //       keterangan: payload.keterangan,
// //       namaTitik: payload.namaTitik,
// //       latTitik: payload.latTitik,
// //       lngTitik: payload.lngTitik,
// //       latPetugas: payload.latPetugas,
// //       lngPetugas: payload.lngPetugas,
// //       jarak: payload.jarak,
// //       timestamp: payload.timestamp,
// //       status: payload.status,
// //       _t: now
// //     });
    
// //     const script = document.createElement("script");
// //     script.id = cbName;
// //     script.src = `${APPS_SCRIPT_URL}?${params.toString()}`;
// //     script.onerror = () => {
// //       if (!resolved) {
// //         resolved = true;
// //         cleanup();
// //         reject(new Error("Network error: Gagal terhubung ke server"));
// //       }
// //     };
    
// //     document.head.appendChild(script);
// //     console.log("📤 JSONP request dikirim");
// //   });
// // };

// // // ── Komponen ─────────────────────────────────────────────
// // const StatusChip = ({ tipe, pesan }) => {
// //   const w = {
// //     error:   { bg:"rgba(239,68,68,0.15)",  br:"rgba(239,68,68,0.4)",  tx:"#f87171", ic:"⚠️" },
// //     sukses:  { bg:"rgba(34,197,94,0.15)",  br:"rgba(34,197,94,0.4)",  tx:"#4ade80", ic:"✅" },
// //     info:    { bg:"rgba(59,130,246,0.15)", br:"rgba(59,130,246,0.4)", tx:"#60a5fa", ic:"ℹ️" },
// //     warning: { bg:"rgba(234,179,8,0.15)",  br:"rgba(234,179,8,0.4)",  tx:"#facc15", ic:"🔴" },
// //   }[tipe] || {};
// //   return (
// //     <div style={{background:w.bg,border:`1px solid ${w.br}`,borderRadius:10,padding:"12px 16px",color:w.tx,fontSize:13,fontWeight:500,display:"flex",alignItems:"flex-start",gap:10,marginTop:12}}>
// //       <span style={{fontSize:16,flexShrink:0}}>{w.ic}</span>
// //       <span style={{lineHeight:1.6,whiteSpace:"pre-line"}}>{pesan}</span>
// //     </div>
// //   );
// // };

// // const Input = ({ label, value, onChange, placeholder, required }) => (
// //   <div style={{marginBottom:14}}>
// //     <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
// //       {label} {required && <span style={{color:"#f87171"}}>*</span>}
// //     </label>
// //     <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
// //       style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box"}}
// //       onFocus={e=>e.target.style.border="1px solid rgba(96,165,250,0.6)"}
// //       onBlur={e=>e.target.style.border="1px solid rgba(255,255,255,0.12)"}
// //     />
// //   </div>
// // );

// // // ── Main Page────────────────────────────────────────────
// // export default function ScanPage() {
// //   const [nama, setNama] = useState("");
// //   const [keterangan, setKeterangan] = useState("");
// //   const [scanning, setScanning] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [status, setStatus] = useState(null);
// //   const [hasilScan, setHasilScan] = useState(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const lastScanTimeRef = useRef(0);

// //   const videoRef = useRef(null);
// //   const readerRef = useRef(null);
// //   const posisiRef = useRef(null);

// //   // Ambil GPS saat mount
// //   useEffect(() => {
// //     dapatkanPosisi()
// //       .then(pos => { posisiRef.current = pos; })
// //       .catch(err => console.warn("GPS gagal:", err.message));
// //   }, []);

// //   const stopCamera = () => {
// //     if (readerRef.current) {
// //       try { readerRef.current.reset(); } catch (err) { console.warn("Gagal menghentikan kamera:", err.message); }
// //       readerRef.current = null;
// //     }
// //     setScanning(false);
// //   };

// //   const mulaiScan = async () => {
// //     if (!nama.trim()) {
// //       setStatus({tipe:"error", pesan:"Nama petugas wajib diisi sebelum scan."});
// //       return;
// //     }

// //     // Refresh GPS setiap scan
// //     try {
// //       const pos = await dapatkanPosisi();
// //       posisiRef.current = pos;
// //     } catch (err) {
// //       setStatus({tipe:"warning", pesan:`GPS tidak tersedia: ${err.message}\nScan tetap bisa dilakukan tapi jarak tidak terverifikasi.`});
// //     }

// //     setScanning(true);
// //     setStatus(null);
// //     setHasilScan(null);

// //     // Tunggu video element siap
// //     await new Promise(r => setTimeout(r, 300));

// //     try {
// //       const { BrowserMultiFormatReader } = await import("@zxing/library");
// //       const reader = new BrowserMultiFormatReader();
// //       readerRef.current = reader;

// //       await reader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
// //         if (result) {
// //           prosesHasilScan(result.getText());
// //         }
// //       });
// //     } catch (err) {
// //       setStatus({tipe:"error", pesan:`Gagal membuka kamera: ${err.message}`});
// //       setScanning(false);
// //     }
// //   };

// //   const prosesHasilScan = async (rawText) => {
// //     // 🔥 Cegah scan lebih dari 1 kali dalam 3 detik
// //     const now = Date.now();
// //     if (now - lastScanTimeRef.current < 3000) {
// //       console.warn("⚠️ Scan terlalu cepat, ignore");
// //       setStatus({
// //         tipe: "warning", 
// //         pesan: "Tunggu sebentar sebelum scan ulang..."
// //       });
// //       return;
// //     }
// //     lastScanTimeRef.current = now;
    
// //     // Cegah submit ganda
// //     if (isSubmitting) {
// //       console.warn("⚠️ Already submitting");
// //       return;
// //     }
    
// //     setIsSubmitting(true);
// //     stopCamera();
// //     setLoading(true);
    
// //     try {
// //       setStatus({tipe: "info", pesan: "🔍 Memverifikasi QR Code..."});
      
// //       // ✅ Verifikasi QR Code
// //       const dataTitik = decodeBarcodeFlexibel(rawText);
// //       if (!dataTitik) {
// //         setStatus({tipe:"error", pesan:"QR Code tidak valid!\nPastikan Anda scan QR Code resmi dari menu Generator QR."});
// //         setLoading(false);
// //         setIsSubmitting(false);
// //         return;
// //       }
      
// //       // ✅ Cek GPS
// //       const posisi = posisiRef.current;
// //       if (!posisi) {
// //         setStatus({tipe:"error", pesan:"Data GPS tidak tersedia. Tutup dan coba lagi."});
// //         setLoading(false);
// //         setIsSubmitting(false);
// //         return;
// //       }

// //       // 📍 LOG LOKASI SAAT SCAN
// //     console.group("📍 INFORMASI LOKASI SCAN");
// //     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
// //     console.log("📱 POSISI PETUGAS:");
// //     console.log(`   Latitude : ${posisi.latitude}`);
// //     console.log(`   Longitude: ${posisi.longitude}`);
// //     console.log(`   Akurasi  : ${posisi.accuracy ? `${posisi.accuracy} meter` : 'Tidak tersedia'}`);
// //     console.log(`   Waktu    : ${new Date().toLocaleString('id-ID')}`);
// //     console.log("");
// //     console.log("📍 TITIK QR CODE:");
// //     console.log(`   Nama     : ${dataTitik.nama}`);
// //     console.log(`   Latitude : ${dataTitik.latitude}`);
// //     console.log(`   Longitude: ${dataTitik.longitude}`);
// //     console.log("");
      
// //       // ✅ Hitung jarak
// //       const jarak = hitungJarak(posisi.latitude, posisi.longitude, dataTitik.latitude, dataTitik.longitude);
// //       const jarakBulat = Math.round(jarak * 10) / 10;
      
// //       // ✅ Cek jarak maksimal
// //       if (jarak > JARAK_MAKS) {
// //         setStatus({tipe:"warning", pesan:`JARAK TERLALU JAUH!\n\nAnda berada ${jarakBulat} meter dari titik "${dataTitik.nama}".\nMaksimal: ${JARAK_MAKS} meter.\n\nPindah lebih dekat lalu scan ulang.`});
// //         setLoading(false);
// //         setIsSubmitting(false);
// //         return;
// //       }
      
// //       // ✅ Siapkan payload
// //       const timestamp = new Date();
// //       const localId = buatId(timestamp);
// //       const sesi = getSesiSaatIni();
// //       const tanggal = formatTanggalPendek(timestamp);
// //       const jam = formatWaktu(timestamp);
      
// //       setStatus({tipe: "info", pesan: "📤 Mengirim data ke server..."});
      
// //       const payload = {
// //         namaPetugas: nama.trim(),
// //         keterangan: keterangan.trim() || "Tidak ada kejadian",
// //         namaTitik: dataTitik.nama,
// //         latTitik: dataTitik.latitude,
// //         lngTitik: dataTitik.longitude,
// //         latPetugas: posisi.latitude,
// //         lngPetugas: posisi.longitude,
// //         jarak: jarakBulat,
// //         timestamp: timestamp.toISOString(),
// //         status: "VALID",
// //       };
      
// //       // ✅ Kirim data
// //       const gasResponse = await simpanDataJSONP(payload);
// //       console.log("✅ GAS response:", gasResponse);
      
// //       // ✅ Tampilkan hasil
// //       setHasilScan({ 
// //         namaTitik: dataTitik.nama, 
// //         jarak: jarakBulat, 
// //         jam, 
// //         tanggal, 
// //         sesi, 
// //         id: gasResponse.id || localId 
// //       });
// //       setStatus({tipe:"sukses", pesan:`Scan berhasil! Titik "${dataTitik.nama}" tercatat pada ${jam} WITA.`});
// //       setKeterangan("");
      
// //     } catch (err) {
// //       console.error("❌ Gagal kirim data:", err);
// //       setStatus({tipe:"error", pesan:`Gagal mengirim data ke server.\nError: ${err.message}\n\nPastikan URL Apps Script sudah benar dan GAS sudah di-deploy ulang.`});
// //     } finally {
// //       setIsSubmitting(false);
// //       setLoading(false);
// //     }
// //   };

// //   // testing data

// //   return (
// //     <div>
// //       <div style={{marginBottom:24}}>
// //         <h1 style={{fontSize:22,fontWeight:700,margin:0,color:"#f1f5f9"}}>Kontrol Keliling</h1>
// //         <p style={{margin:"4px 0 0",fontSize:13,color:"#64748b"}}>{getSesiSaatIni()} · {formatTanggalPendek()}</p>
// //       </div>

// //       <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:20,marginBottom:16}}>
// //         <Input label="Nama Petugas" value={nama} onChange={setNama} placeholder="Masukkan nama lengkap" required />
// //         <div>
// //           <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
// //             Keterangan / Kejadian
// //           </label>
// //           <textarea value={keterangan} onChange={e=>setKeterangan(e.target.value)}
// //             placeholder="Tulis kejadian atau kondisi (opsional)" rows={3}
// //             style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",lineHeight:1.5}}
// //             onFocus={e=>e.target.style.border="1px solid rgba(96,165,250,0.6)"}
// //             onBlur={e=>e.target.style.border="1px solid rgba(255,255,255,0.12)"}
// //           />
// //         </div>
// //       </div>

// //       {scanning && (
// //         <div style={{position:"relative",borderRadius:16,overflow:"hidden",marginBottom:16,background:"#000",aspectRatio:"4/3"}}>
// //           <video ref={videoRef} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} playsInline muted autoPlay />
// //           <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
// //             <div style={{position:"relative",width:200,height:200}}>
// //               {[
// //                 {top:0,left:0,borderTop:"3px solid #3b82f6",borderLeft:"3px solid #3b82f6"},
// //                 {top:0,right:0,borderTop:"3px solid #3b82f6",borderRight:"3px solid #3b82f6"},
// //                 {bottom:0,left:0,borderBottom:"3px solid #3b82f6",borderLeft:"3px solid #3b82f6"},
// //                 {bottom:0,right:0,borderBottom:"3px solid #3b82f6",borderRight:"3px solid #3b82f6"},
// //               ].map((s,i)=><div key={i} style={{position:"absolute",width:30,height:30,...s}}/>)}
// //               <div style={{position:"absolute",left:0,right:0,height:2,background:"rgba(59,130,246,0.8)",animation:"scanline 2s linear infinite",top:0}}/>
// //             </div>
// //           </div>
// //           <div style={{position:"absolute",bottom:16,left:0,right:0,textAlign:"center"}}>
// //             <span style={{background:"rgba(0,0,0,0.6)",color:"#93c5fd",fontSize:12,padding:"6px 16px",borderRadius:20}}>
// //               Arahkan ke QR Code patroli
// //             </span>
// //           </div>
// //           <button onClick={stopCamera} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.7)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"white",padding:"6px 14px",fontSize:12,cursor:"pointer"}}>
// //             ✕ Batal
// //           </button>
// //         </div>
// //       )}

// //       <style>{`
// //         @keyframes scanline { 0%{top:0} 100%{top:196px} }
// //         @keyframes spin { to{transform:rotate(360deg)} }
// //       `}</style>

// //       {status && <StatusChip tipe={status.tipe} pesan={status.pesan} />}

// //       {hasilScan && (
// //         <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:16,padding:20,marginTop:16}}>
// //           <div style={{fontSize:11,fontWeight:700,color:"#4ade80",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>✅ Berhasil Tercatat di Spreadsheet</div>
// //           <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
// //             {[["Titik",hasilScan.namaTitik],["Jarak",`${hasilScan.jarak} m`],["Waktu",hasilScan.jam],["Sesi",hasilScan.sesi]].map(([k,v])=>(
// //               <div key={k} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px"}}>
// //                 <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{k}</div>
// //                 <div style={{fontSize:14,fontWeight:600,color:"#e2e8f0"}}>{v}</div>
// //               </div>
// //             ))}
// //           </div>
// //           <div style={{fontSize:10,color:"#475569",marginTop:12,textAlign:"center",fontFamily:"monospace"}}>{hasilScan.id}</div>
// //         </div>
// //       )}

// //       {!scanning && (
// //         <button onClick={mulaiScan} disabled={loading}
// //           style={{width:"100%",marginTop:20,padding:"16px",background:loading?"rgba(59,130,246,0.3)":"linear-gradient(135deg,#2563eb,#7c3aed)",border:"none",borderRadius:14,color:"white",fontSize:16,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:loading?"none":"0 4px 24px rgba(37,99,235,0.4)",fontFamily:"inherit"}}>
// //           {loading ? (
// //             <span style={{display:"flex",alignItems:"center",gap:8}}>
// //               <span style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}}/>
// //               Memproses...
// //             </span>
// //           ) : (
// //             <>
// //               <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
// //                 <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M22 5h-6v6h6V5zm-6 8h1.5v1.5H16V13zm1.5 1.5H19V16h-1.5v-1.5zM19 13h1.5v1.5H19V13zm-3 3h1.5v1.5H16V16zm1.5 1.5H19V19h-1.5v-1.5zM19 16h1.5v1.5H19V16zm1.5-1.5H22V16h-1.5v-1.5zm0 3H22V19h-1.5v-1.5z"/>
// //               </svg>
// //               SCAN QR CODE PATROLI
// //             </>
// //           )}
// //         </button>
// //       )}

// //       <div style={{marginTop:16,padding:"12px 16px",background:"rgba(255,255,255,0.02)",borderRadius:10,display:"flex",alignItems:"center",gap:10}}>
// //         <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
// //         <span style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>
// //           Maksimal jarak scan: <strong style={{color:"#94a3b8"}}>{JARAK_MAKS} meter</strong> dari titik QR Code.
// //         </span>
// //       </div>
// //     </div>
// //   );
// // }



// import { useState, useRef, useEffect } from "react";
// import { hitungJarak, dapatkanPosisi, getSesiSaatIni, formatWaktu, formatTanggalPendek } from "../utils/index";
// import { APPS_SCRIPT_URL } from "../App";

// const JARAK_MAKS = 25;
// let lastSubmittedData = null;

// // ── Tema warna ────────────────────────────────────────────
// const THEMES = {
//   dark: {
//     titleColor:   "#f1f5f9",
//     subColor:     "#64748b",
//     cardBg:       "rgba(255,255,255,0.03)",
//     cardBorder:   "rgba(255,255,255,0.08)",
//     inputBg:      "rgba(255,255,255,0.05)",
//     inputBorder:  "rgba(255,255,255,0.12)",
//     inputFocus:   "rgba(96,165,250,0.6)",
//     inputColor:   "#f1f5f9",
//     inputPlaceholder: "#475569",
//     labelColor:   "#94a3b8",
//     infoBg:       "rgba(255,255,255,0.02)",
//     infoIconFill: "#64748b",
//     infoText:     "#64748b",
//     infoStrong:   "#94a3b8",
//     resultCardBg: "rgba(255,255,255,0.04)",
//     resultCardLabel: "#64748b",
//     resultCardValue: "#e2e8f0",
//     resultIdColor:"#475569",
//     scanBtnDisabled: "rgba(59,130,246,0.3)",
//   },
//   light: {
//     titleColor:   "#1e293b",
//     subColor:     "#64748b",
//     cardBg:       "rgba(255,255,255,0.85)",
//     cardBorder:   "#dde5f3",
//     inputBg:      "#f8faff",
//     inputBorder:  "#d1daf7",
//     inputFocus:   "rgba(29,78,216,0.5)",
//     inputColor:   "#1e293b",
//     inputPlaceholder: "#94a3b8",
//     labelColor:   "#64748b",
//     infoBg:       "rgba(241,245,255,0.8)",
//     infoIconFill: "#94a3b8",
//     infoText:     "#64748b",
//     infoStrong:   "#475569",
//     resultCardBg: "rgba(241,245,249,0.8)",
//     resultCardLabel: "#64748b",
//     resultCardValue: "#1e293b",
//     resultIdColor:"#94a3b8",
//     scanBtnDisabled: "rgba(37,99,235,0.3)",
//   }
// };

// // ── Decode QR ────────────────────────────────────────────
// const decodeBarcodeFlexibel = (rawText) => {
//   try {
//     const p = JSON.parse(rawText);
//     if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
//       return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
//   } catch (err) { console.warn("Bukan JSON langsung:", err.message); }

//   try {
//     const decoded = atob(rawText);
//     try {
//       const p = JSON.parse(decoded);
//       if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
//         return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
//     } catch (err) { console.warn("Bukan JSON Base64:", err.message); }
//     const parts = decoded.split("|");
//     if (parts.length === 3) {
//       const lat = parseFloat(parts[1]), lng = parseFloat(parts[2]);
//       if (!isNaN(lat) && !isNaN(lng)) return { nama: parts[0], latitude: lat, longitude: lng };
//     }
//   } catch (err) { console.warn("Gagal mendekode Base64:", err.message); }

//   try {
//     const p = JSON.parse(decodeURIComponent(rawText));
//     if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
//       return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
//   } catch (err) { console.warn("Bukan JSON URI:", err.message); }

//   const parts = rawText.split("|");
//   if (parts.length === 3) {
//     const lat = parseFloat(parts[1]), lng = parseFloat(parts[2]);
//     if (!isNaN(lat) && !isNaN(lng)) return { nama: parts[0], latitude: lat, longitude: lng };
//   }

//   return null;
// };

// // ── Generate ID lokal ────────────────────────────────────
// const buatId = (now) => {
//   const pad = (n) => String(n).padStart(2, "0");
//   return `PTR-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
// };

// // ── JSONP dengan guard terhadap double execution ──
// const simpanDataJSONP = (payload) => {
//   return new Promise((resolve, reject) => {
//     const requestKey = `${payload.namaPetugas}_${payload.namaTitik}_${payload.timestamp}`;
//     const now = Date.now();
    
//     if (lastSubmittedData && 
//         lastSubmittedData.key === requestKey && 
//         (now - lastSubmittedData.time) < 5000) {
//       console.warn("⚠️ Duplicate request dalam 5 detik, ignored");
//       reject(new Error("Duplicate request ignored"));
//       return;
//     }
    
//     lastSubmittedData = { key: requestKey, time: now };
    
//     setTimeout(() => {
//       if (lastSubmittedData?.key === requestKey) lastSubmittedData = null;
//     }, 5000);
    
//     let resolved = false;
//     const cbName = `gasCallback_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    
//     const timer = setTimeout(() => {
//       if (!resolved) {
//         resolved = true;
//         cleanup();
//         reject(new Error("Timeout: GAS tidak merespons"));
//       }
//     }, 15000);
    
//     const cleanup = () => {
//       clearTimeout(timer);
//       delete window[cbName];
//       const el = document.getElementById(cbName);
//       if (el) el.remove();
//     };
    
//     window[cbName] = (data) => {
//       if (!resolved) {
//         resolved = true;
//         cleanup();
//         if (data && data.success) resolve(data);
//         else reject(new Error(data?.message || "Gagal menyimpan data"));
//       } else {
//         console.warn("⚠️ Callback already executed, ignoring duplicate");
//       }
//     };
    
//     const params = new URLSearchParams({
//       action: "savePatrol",
//       callback: cbName,
//       namaPetugas: payload.namaPetugas,
//       keterangan: payload.keterangan,
//       namaTitik: payload.namaTitik,
//       latTitik: payload.latTitik,
//       lngTitik: payload.lngTitik,
//       latPetugas: payload.latPetugas,
//       lngPetugas: payload.lngPetugas,
//       jarak: payload.jarak,
//       timestamp: payload.timestamp,
//       status: payload.status,
//       _t: now
//     });
    
//     const script = document.createElement("script");
//     script.id = cbName;
//     script.src = `${APPS_SCRIPT_URL}?${params.toString()}`;
//     script.onerror = () => {
//       if (!resolved) {
//         resolved = true;
//         cleanup();
//         reject(new Error("Network error: Gagal terhubung ke server"));
//       }
//     };
    
//     document.head.appendChild(script);
//     console.log("📤 JSONP request dikirim");
//   });
// };

// // ── StatusChip ───────────────────────────────────────────
// const StatusChip = ({ tipe, pesan, theme }) => {
//   const isDark = theme === "dark";
//   const w = {
//     error:   { bg: isDark ? "rgba(239,68,68,0.15)"  : "rgba(239,68,68,0.1)",   br: isDark ? "rgba(239,68,68,0.4)"   : "rgba(239,68,68,0.35)",   tx: isDark ? "#f87171" : "#dc2626", ic: "⚠️" },
//     sukses:  { bg: isDark ? "rgba(34,197,94,0.15)"  : "rgba(34,197,94,0.12)",  br: isDark ? "rgba(34,197,94,0.4)"   : "rgba(34,197,94,0.4)",    tx: isDark ? "#4ade80" : "#16a34a", ic: "✅" },
//     info:    { bg: isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.1)",  br: isDark ? "rgba(59,130,246,0.4)"  : "rgba(59,130,246,0.35)",  tx: isDark ? "#60a5fa" : "#1d4ed8", ic: "ℹ️" },
//     warning: { bg: isDark ? "rgba(234,179,8,0.15)"  : "rgba(234,179,8,0.12)",  br: isDark ? "rgba(234,179,8,0.4)"   : "rgba(234,179,8,0.4)",    tx: isDark ? "#facc15" : "#b45309", ic: "🔴" },
//   }[tipe] || {};
//   return (
//     <div style={{background:w.bg,border:`1px solid ${w.br}`,borderRadius:10,padding:"12px 16px",color:w.tx,fontSize:13,fontWeight:500,display:"flex",alignItems:"flex-start",gap:10,marginTop:12}}>
//       <span style={{fontSize:16,flexShrink:0}}>{w.ic}</span>
//       <span style={{lineHeight:1.6,whiteSpace:"pre-line"}}>{pesan}</span>
//     </div>
//   );
// };

// // ── Input ────────────────────────────────────────────────
// const Input = ({ label, value, onChange, placeholder, required, T }) => (
//   <div style={{marginBottom:14}}>
//     <label style={{fontSize:11,fontWeight:600,color:T.labelColor,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
//       {label} {required && <span style={{color:"#f87171"}}>*</span>}
//     </label>
//     <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
//       style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:10,padding:"12px 14px",color:T.inputColor,fontSize:14,outline:"none",boxSizing:"border-box"}}
//       onFocus={e=>e.target.style.border=`1px solid ${T.inputFocus}`}
//       onBlur={e=>e.target.style.border=`1px solid ${T.inputBorder}`}
//     />
//   </div>
// );

// // ── Main Page ────────────────────────────────────────────
// export default function ScanPage({ theme = "dark" }) {
//   const [nama, setNama] = useState("");
//   const [keterangan, setKeterangan] = useState("");
//   const [scanning, setScanning] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState(null);
//   const [hasilScan, setHasilScan] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const lastScanTimeRef = useRef(0);

//   const videoRef = useRef(null);
//   const readerRef = useRef(null);
//   const posisiRef = useRef(null);

//   const T = THEMES[theme] || THEMES.dark;

//   useEffect(() => {
//     dapatkanPosisi()
//       .then(pos => { posisiRef.current = pos; })
//       .catch(err => console.warn("GPS gagal:", err.message));
//   }, []);

//   const stopCamera = () => {
//     if (readerRef.current) {
//       try { readerRef.current.reset(); } catch (err) { console.warn("Gagal menghentikan kamera:", err.message); }
//       readerRef.current = null;
//     }
//     setScanning(false);
//   };

//   const mulaiScan = async () => {
//     if (!nama.trim()) {
//       setStatus({tipe:"error", pesan:"Nama petugas wajib diisi sebelum scan."});
//       return;
//     }

//     try {
//       const pos = await dapatkanPosisi();
//       posisiRef.current = pos;
//     } catch (err) {
//       setStatus({tipe:"warning", pesan:`GPS tidak tersedia: ${err.message}\nScan tetap bisa dilakukan tapi jarak tidak terverifikasi.`});
//     }

//     setScanning(true);
//     setStatus(null);
//     setHasilScan(null);

//     await new Promise(r => setTimeout(r, 300));

//     try {
//       const { BrowserMultiFormatReader } = await import("@zxing/library");
//       const reader = new BrowserMultiFormatReader();
//       readerRef.current = reader;

//       await reader.decodeFromVideoDevice(null, videoRef.current, (result) => {
//         if (result) prosesHasilScan(result.getText());
//       });
//     } catch (err) {
//       setStatus({tipe:"error", pesan:`Gagal membuka kamera: ${err.message}`});
//       setScanning(false);
//     }
//   };

//   const prosesHasilScan = async (rawText) => {
//     const now = Date.now();
//     if (now - lastScanTimeRef.current < 3000) {
//       setStatus({ tipe: "warning", pesan: "Tunggu sebentar sebelum scan ulang..." });
//       return;
//     }
//     lastScanTimeRef.current = now;
    
//     if (isSubmitting) return;
    
//     setIsSubmitting(true);
//     stopCamera();
//     setLoading(true);
    
//     try {
//       setStatus({tipe: "info", pesan: "🔍 Memverifikasi QR Code..."});
      
//       const dataTitik = decodeBarcodeFlexibel(rawText);
//       if (!dataTitik) {
//         setStatus({tipe:"error", pesan:"QR Code tidak valid!\nPastikan Anda scan QR Code resmi dari menu Generator QR."});
//         setLoading(false);
//         setIsSubmitting(false);
//         return;
//       }
      
//       const posisi = posisiRef.current;
//       if (!posisi) {
//         setStatus({tipe:"error", pesan:"Data GPS tidak tersedia. Tutup dan coba lagi."});
//         setLoading(false);
//         setIsSubmitting(false);
//         return;
//       }

//       console.group("📍 INFORMASI LOKASI SCAN");
//       console.log("📱 POSISI PETUGAS:");
//       console.log(`   Latitude : ${posisi.latitude}`);
//       console.log(`   Longitude: ${posisi.longitude}`);
//       console.log(`   Akurasi  : ${posisi.accuracy ? `${posisi.accuracy} meter` : 'Tidak tersedia'}`);
//       console.log("📍 TITIK QR CODE:");
//       console.log(`   Nama     : ${dataTitik.nama}`);
//       console.log(`   Latitude : ${dataTitik.latitude}`);
//       console.log(`   Longitude: ${dataTitik.longitude}`);
//       console.groupEnd();
      
//       const jarak = hitungJarak(posisi.latitude, posisi.longitude, dataTitik.latitude, dataTitik.longitude);
//       const jarakBulat = Math.round(jarak * 10) / 10;
      
//       if (jarak > JARAK_MAKS) {
//         setStatus({tipe:"warning", pesan:`JARAK TERLALU JAUH!\n\nAnda berada ${jarakBulat} meter dari titik "${dataTitik.nama}".\nMaksimal: ${JARAK_MAKS} meter.\n\nPindah lebih dekat lalu scan ulang.`});
//         setLoading(false);
//         setIsSubmitting(false);
//         return;
//       }
      
//       const timestamp = new Date();
//       const localId = buatId(timestamp);
//       const sesi = getSesiSaatIni();
//       const tanggal = formatTanggalPendek(timestamp);
//       const jam = formatWaktu(timestamp);
      
//       setStatus({tipe: "info", pesan: "📤 Mengirim data ke server..."});
      
//       const payload = {
//         namaPetugas: nama.trim(),
//         keterangan: keterangan.trim() || "Tidak ada kejadian",
//         namaTitik: dataTitik.nama,
//         latTitik: dataTitik.latitude,
//         lngTitik: dataTitik.longitude,
//         latPetugas: posisi.latitude,
//         lngPetugas: posisi.longitude,
//         jarak: jarakBulat,
//         timestamp: timestamp.toISOString(),
//         status: "VALID",
//       };
      
//       const gasResponse = await simpanDataJSONP(payload);
//       console.log("✅ GAS response:", gasResponse);
      
//       setHasilScan({ 
//         namaTitik: dataTitik.nama, 
//         jarak: jarakBulat, 
//         jam, 
//         tanggal, 
//         sesi, 
//         id: gasResponse.id || localId 
//       });
//       setStatus({tipe:"sukses", pesan:`Scan berhasil! Titik "${dataTitik.nama}" tercatat pada ${jam} WITA.`});
//       setKeterangan("");
      
//     } catch (err) {
//       console.error("❌ Gagal kirim data:", err);
//       setStatus({tipe:"error", pesan:`Gagal mengirim data ke server.\nError: ${err.message}\n\nPastikan URL Apps Script sudah benar dan GAS sudah di-deploy ulang.`});
//     } finally {
//       setIsSubmitting(false);
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div style={{marginBottom:24}}>
//         <h1 style={{fontSize:22,fontWeight:700,margin:0,color:T.titleColor}}>Kontrol Keliling</h1>
//         <p style={{margin:"4px 0 0",fontSize:13,color:T.subColor}}>{getSesiSaatIni()} · {formatTanggalPendek()}</p>
//       </div>

//       <div style={{background:T.cardBg,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:20,marginBottom:16}}>
//         <Input label="Nama Petugas" value={nama} onChange={setNama} placeholder="Masukkan nama lengkap" required T={T} />
//         <div>
//           <label style={{fontSize:11,fontWeight:600,color:T.labelColor,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
//             Keterangan / Kejadian
//           </label>
//           <textarea value={keterangan} onChange={e=>setKeterangan(e.target.value)}
//             placeholder="Tulis kejadian atau kondisi (opsional)" rows={3}
//             style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:10,padding:"12px 14px",color:T.inputColor,fontSize:14,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",lineHeight:1.5}}
//             onFocus={e=>e.target.style.border=`1px solid ${T.inputFocus}`}
//             onBlur={e=>e.target.style.border=`1px solid ${T.inputBorder}`}
//           />
//         </div>
//       </div>

//       {scanning && (
//         <div style={{position:"relative",borderRadius:16,overflow:"hidden",marginBottom:16,background:"#000",aspectRatio:"4/3"}}>
//           <video ref={videoRef} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} playsInline muted autoPlay />
//           <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
//             <div style={{position:"relative",width:200,height:200}}>
//               {[
//                 {top:0,left:0,borderTop:"3px solid #3b82f6",borderLeft:"3px solid #3b82f6"},
//                 {top:0,right:0,borderTop:"3px solid #3b82f6",borderRight:"3px solid #3b82f6"},
//                 {bottom:0,left:0,borderBottom:"3px solid #3b82f6",borderLeft:"3px solid #3b82f6"},
//                 {bottom:0,right:0,borderBottom:"3px solid #3b82f6",borderRight:"3px solid #3b82f6"},
//               ].map((s,i)=><div key={i} style={{position:"absolute",width:30,height:30,...s}}/>)}
//               <div style={{position:"absolute",left:0,right:0,height:2,background:"rgba(59,130,246,0.8)",animation:"scanline 2s linear infinite",top:0}}/>
//             </div>
//           </div>
//           <div style={{position:"absolute",bottom:16,left:0,right:0,textAlign:"center"}}>
//             <span style={{background:"rgba(0,0,0,0.6)",color:"#93c5fd",fontSize:12,padding:"6px 16px",borderRadius:20}}>
//               Arahkan ke QR Code patroli
//             </span>
//           </div>
//           <button onClick={stopCamera} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.7)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"white",padding:"6px 14px",fontSize:12,cursor:"pointer"}}>
//             ✕ Batal
//           </button>
//         </div>
//       )}

//       <style>{`
//         @keyframes scanline { 0%{top:0} 100%{top:196px} }
//         @keyframes spin { to{transform:rotate(360deg)} }
//       `}</style>

//       {status && <StatusChip tipe={status.tipe} pesan={status.pesan} theme={theme} />}

//       {hasilScan && (
//         <div style={{
//           background: theme === "dark" ? "rgba(34,197,94,0.08)" : "rgba(22,163,74,0.08)",
//           border: theme === "dark" ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(22,163,74,0.3)",
//           borderRadius:16,padding:20,marginTop:16
//         }}>
//           <div style={{fontSize:11,fontWeight:700,color: theme === "dark" ? "#4ade80" : "#16a34a",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>✅ Berhasil Tercatat di Spreadsheet</div>
//           <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
//             {[["Titik",hasilScan.namaTitik],["Jarak",`${hasilScan.jarak} m`],["Waktu",hasilScan.jam],["Sesi",hasilScan.sesi]].map(([k,v])=>(
//               <div key={k} style={{background:T.resultCardBg,borderRadius:10,padding:"10px 12px"}}>
//                 <div style={{fontSize:10,color:T.resultCardLabel,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{k}</div>
//                 <div style={{fontSize:14,fontWeight:600,color:T.resultCardValue}}>{v}</div>
//               </div>
//             ))}
//           </div>
//           <div style={{fontSize:10,color:T.resultIdColor,marginTop:12,textAlign:"center",fontFamily:"monospace"}}>{hasilScan.id}</div>
//         </div>
//       )}

//       {!scanning && (
//         <button onClick={mulaiScan} disabled={loading}
//           style={{width:"100%",marginTop:20,padding:"16px",background:loading?T.scanBtnDisabled:"linear-gradient(135deg,#2563eb,#7c3aed)",border:"none",borderRadius:14,color:"white",fontSize:16,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:loading?"none":"0 4px 24px rgba(37,99,235,0.4)",fontFamily:"inherit"}}>
//           {loading ? (
//             <span style={{display:"flex",alignItems:"center",gap:8}}>
//               <span style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}}/>
//               Memproses...
//             </span>
//           ) : (
//             <>
//               <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
//                 <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M22 5h-6v6h6V5zm-6 8h1.5v1.5H16V13zm1.5 1.5H19V16h-1.5v-1.5zM19 13h1.5v1.5H19V13zm-3 3h1.5v1.5H16V16zm1.5 1.5H19V19h-1.5v-1.5zM19 16h1.5v1.5H19V16zm1.5-1.5H22V16h-1.5v-1.5zm0 3H22V19h-1.5v-1.5z"/>
//               </svg>
//               SCAN QR CODE PATROLI
//             </>
//           )}
//         </button>
//       )}

//       <div style={{marginTop:16,padding:"12px 16px",background:T.infoBg,border:`1px solid ${T.cardBorder}`,borderRadius:10,display:"flex",alignItems:"center",gap:10}}>
//         <svg width="16" height="16" viewBox="0 0 24 24" fill={T.infoIconFill}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
//         <span style={{fontSize:12,color:T.infoText,lineHeight:1.5}}>
//           Maksimal jarak scan: <strong style={{color:T.infoStrong}}>{JARAK_MAKS} meter</strong> dari titik QR Code.
//         </span>
//       </div>
//     </div>
//   );
// }



// ScanPage.js (disesuaikan dengan tema - tambahkan import React di awal jika belum ada)
import { useState, useRef, useEffect } from "react";
import { hitungJarak, dapatkanPosisi, getSesiSaatIni, formatWaktu, formatTanggalPendek } from "../utils/index";
import { APPS_SCRIPT_URL, THEMES } from "./Homepage";

const JARAK_MAKS = 25;
let lastSubmittedData = null;

const decodeBarcodeFlexibel = (rawText) => {
  try {
    const p = JSON.parse(rawText);
    if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
      return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
  } catch (err) { console.warn("Bukan JSON langsung:", err.message); }

  try {
    const decoded = atob(rawText);
    try {
      const p = JSON.parse(decoded);
      if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
        return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
    } catch (err) { console.warn("Bukan JSON Base64:", err.message); }
    const parts = decoded.split("|");
    if (parts.length === 3) {
      const lat = parseFloat(parts[1]), lng = parseFloat(parts[2]);
      if (!isNaN(lat) && !isNaN(lng)) return { nama: parts[0], latitude: lat, longitude: lng };
    }
  } catch (err) { console.warn("Gagal mendekode Base64:", err.message); }

  try {
    const p = JSON.parse(decodeURIComponent(rawText));
    if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
      return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
  } catch (err) { console.warn("Bukan JSON URI:", err.message); }

  const parts = rawText.split("|");
  if (parts.length === 3) {
    const lat = parseFloat(parts[1]), lng = parseFloat(parts[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { nama: parts[0], latitude: lat, longitude: lng };
  }

  return null;
};

const buatId = (now) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `PTR-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

const simpanDataJSONP = (payload) => {
  return new Promise((resolve, reject) => {
    const requestKey = `${payload.namaPetugas}_${payload.namaTitik}_${payload.timestamp}`;
    const now = Date.now();
    
    if (lastSubmittedData && 
        lastSubmittedData.key === requestKey && 
        (now - lastSubmittedData.time) < 5000) {
      console.warn("⚠️ Duplicate request dalam 5 detik, ignored");
      reject(new Error("Duplicate request ignored"));
      return;
    }
    
    lastSubmittedData = { key: requestKey, time: now };
    
    setTimeout(() => {
      if (lastSubmittedData?.key === requestKey) lastSubmittedData = null;
    }, 5000);
    
    let resolved = false;
    const cbName = `gasCallback_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        reject(new Error("Timeout: GAS tidak merespons"));
      }
    }, 15000);
    
    const cleanup = () => {
      clearTimeout(timer);
      delete window[cbName];
      const el = document.getElementById(cbName);
      if (el) el.remove();
    };
    
    window[cbName] = (data) => {
      if (!resolved) {
        resolved = true;
        cleanup();
        if (data && data.success) resolve(data);
        else reject(new Error(data?.message || "Gagal menyimpan data"));
      } else {
        console.warn("⚠️ Callback already executed, ignoring duplicate");
      }
    };
    
    const params = new URLSearchParams({
      action: "savePatrol",
      callback: cbName,
      namaPetugas: payload.namaPetugas,
      keterangan: payload.keterangan,
      namaTitik: payload.namaTitik,
      latTitik: payload.latTitik,
      lngTitik: payload.lngTitik,
      latPetugas: payload.latPetugas,
      lngPetugas: payload.lngPetugas,
      jarak: payload.jarak,
      timestamp: payload.timestamp,
      status: payload.status,
      _t: now
    });
    
    const script = document.createElement("script");
    script.id = cbName;
    script.src = `${APPS_SCRIPT_URL}?${params.toString()}`;
    script.onerror = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        reject(new Error("Network error: Gagal terhubung ke server"));
      }
    };
    
    document.head.appendChild(script);
    console.log("📤 JSONP request dikirim");
  });
};

const StatusChip = ({ tipe, pesan, theme }) => {
  const isDark = theme === "dark";
  const w = {
    error:   { bg: isDark ? "rgba(239,68,68,0.15)"  : "rgba(239,68,68,0.1)",   br: isDark ? "rgba(239,68,68,0.4)"   : "rgba(239,68,68,0.35)",   tx: isDark ? "#f87171" : "#dc2626", ic: "⚠️" },
    sukses:  { bg: isDark ? "rgba(34,197,94,0.15)"  : "rgba(34,197,94,0.12)",  br: isDark ? "rgba(34,197,94,0.4)"   : "rgba(34,197,94,0.4)",    tx: isDark ? "#4ade80" : "#16a34a", ic: "✅" },
    info:    { bg: isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.1)",  br: isDark ? "rgba(59,130,246,0.4)"  : "rgba(59,130,246,0.35)",  tx: isDark ? "#60a5fa" : "#2563eb", ic: "ℹ️" },
    warning: { bg: isDark ? "rgba(234,179,8,0.15)"  : "rgba(234,179,8,0.12)",  br: isDark ? "rgba(234,179,8,0.4)"   : "rgba(234,179,8,0.4)",    tx: isDark ? "#facc15" : "#b45309", ic: "🔴" },
  }[tipe] || {};
  return (
    <div style={{background:w.bg,border:`1px solid ${w.br}`,borderRadius:10,padding:"12px 16px",color:w.tx,fontSize:13,fontWeight:500,display:"flex",alignItems:"flex-start",gap:10,marginTop:12}}>
      <span style={{fontSize:16,flexShrink:0}}>{w.ic}</span>
      <span style={{lineHeight:1.6,whiteSpace:"pre-line"}}>{pesan}</span>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, required, theme }) => {
  const isDark = theme === "dark";
  const T = THEMES[theme];
  
  return (
    <div style={{marginBottom:14}}>
      <label style={{fontSize:11,fontWeight:600,color:T.subColor,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
        {label} {required && <span style={{color:"#f87171"}}>*</span>}
      </label>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",background:isDark ? "rgba(255,255,255,0.05)" : "#f8faff",border:`1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#d1daf7"}`,borderRadius:10,padding:"12px 14px",color:T.titleColor,fontSize:14,outline:"none",boxSizing:"border-box"}}
        onFocus={e=>e.target.style.border=`1px solid ${isDark ? "#60a5fa" : "#2563eb"}`}
        onBlur={e=>e.target.style.border=`1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#d1daf7"}`}
      />
    </div>
  );
};

export default function ScanPage({ theme = "dark" }) {
  const [nama, setNama] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [hasilScan, setHasilScan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastScanTimeRef = useRef(0);

  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const posisiRef = useRef(null);

  const T = THEMES[theme];
  const isDark = theme === "dark";

  useEffect(() => {
    dapatkanPosisi()
      .then(pos => { posisiRef.current = pos; })
      .catch(err => console.warn("GPS gagal:", err.message));
  }, []);

  const stopCamera = () => {
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch (err) { console.warn("Gagal menghentikan kamera:", err.message); }
      readerRef.current = null;
    }
    setScanning(false);
  };

  const mulaiScan = async () => {
    if (!nama.trim()) {
      setStatus({tipe:"error", pesan:"Nama petugas wajib diisi sebelum scan."});
      return;
    }

    try {
      const pos = await dapatkanPosisi();
      posisiRef.current = pos;
    } catch (err) {
      setStatus({tipe:"warning", pesan:`GPS tidak tersedia: ${err.message}\nScan tetap bisa dilakukan tapi jarak tidak terverifikasi.`});
    }

    setScanning(true);
    setStatus(null);
    setHasilScan(null);

    await new Promise(r => setTimeout(r, 300));

    try {
      const { BrowserMultiFormatReader } = await import("@zxing/library");
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      await reader.decodeFromVideoDevice(null, videoRef.current, (result) => {
        if (result) prosesHasilScan(result.getText());
      });
    } catch (err) {
      setStatus({tipe:"error", pesan:`Gagal membuka kamera: ${err.message}`});
      setScanning(false);
    }
  };

  const prosesHasilScan = async (rawText) => {
    const now = Date.now();
    if (now - lastScanTimeRef.current < 3000) {
      setStatus({ tipe: "warning", pesan: "Tunggu sebentar sebelum scan ulang..." });
      return;
    }
    lastScanTimeRef.current = now;
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    stopCamera();
    setLoading(true);
    
    try {
      setStatus({tipe: "info", pesan: "🔍 Memverifikasi QR Code..."});
      
      const dataTitik = decodeBarcodeFlexibel(rawText);
      if (!dataTitik) {
        setStatus({tipe:"error", pesan:"QR Code tidak valid!\nPastikan Anda scan QR Code resmi dari menu Generator QR."});
        setLoading(false);
        setIsSubmitting(false);
        return;
      }
      
      const posisi = posisiRef.current;
      if (!posisi) {
        setStatus({tipe:"error", pesan:"Data GPS tidak tersedia. Tutup dan coba lagi."});
        setLoading(false);
        setIsSubmitting(false);
        return;
      }

      console.group("📍 INFORMASI LOKASI SCAN");
      console.log("📱 POSISI PETUGAS:");
      console.log(`   Latitude : ${posisi.latitude}`);
      console.log(`   Longitude: ${posisi.longitude}`);
      console.log(`   Akurasi  : ${posisi.accuracy ? `${posisi.accuracy} meter` : 'Tidak tersedia'}`);
      console.log("📍 TITIK QR CODE:");
      console.log(`   Nama     : ${dataTitik.nama}`);
      console.log(`   Latitude : ${dataTitik.latitude}`);
      console.log(`   Longitude: ${dataTitik.longitude}`);
      console.groupEnd();
      
      const jarak = hitungJarak(posisi.latitude, posisi.longitude, dataTitik.latitude, dataTitik.longitude);
      const jarakBulat = Math.round(jarak * 10) / 10;
      
      if (jarak > JARAK_MAKS) {
        setStatus({tipe:"warning", pesan:`JARAK TERLALU JAUH!\n\nAnda berada ${jarakBulat} meter dari titik "${dataTitik.nama}".\nMaksimal: ${JARAK_MAKS} meter.\n\nPindah lebih dekat lalu scan ulang.`});
        setLoading(false);
        setIsSubmitting(false);
        return;
      }
      
      const timestamp = new Date();
      const localId = buatId(timestamp);
      const sesi = getSesiSaatIni();
      const jam = formatWaktu(timestamp);
      
      setStatus({tipe: "info", pesan: "📤 Mengirim data ke server..."});
      
      const payload = {
        namaPetugas: nama.trim(),
        keterangan: keterangan.trim() || "Tidak ada kejadian",
        namaTitik: dataTitik.nama,
        latTitik: dataTitik.latitude,
        lngTitik: dataTitik.longitude,
        latPetugas: posisi.latitude,
        lngPetugas: posisi.longitude,
        jarak: jarakBulat,
        timestamp: timestamp.toISOString(),
        status: "VALID",
      };
      
      const gasResponse = await simpanDataJSONP(payload);
      console.log("✅ GAS response:", gasResponse);
      
      setHasilScan({ 
        namaTitik: dataTitik.nama, 
        jarak: jarakBulat, 
        jam, 
        tanggal: formatTanggalPendek(timestamp), 
        sesi, 
        id: gasResponse.id || localId 
      });
      setStatus({tipe:"sukses", pesan:`Scan berhasil! Titik "${dataTitik.nama}" tercatat pada ${jam} WITA.`});
      setKeterangan("");
      
    } catch (err) {
      console.error("❌ Gagal kirim data:", err);
      setStatus({tipe:"error", pesan:`Gagal mengirim data ke server.\nError: ${err.message}\n\nPastikan URL Apps Script sudah benar dan GAS sudah di-deploy ulang.`});
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22,fontWeight:700,margin:0,color:T.titleColor}}>Kontrol Keliling</h1>
        <p style={{margin:"4px 0 0",fontSize:13,color:T.subColor}}>{getSesiSaatIni()} · {formatTanggalPendek()}</p>
      </div>

      <div style={{background:T.cardBg || (isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)"),border:`1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#dde5f3"}`,borderRadius:16,padding:20,marginBottom:16}}>
        <Input label="Nama Petugas" value={nama} onChange={setNama} placeholder="Masukkan nama lengkap" required theme={theme} />
        <div>
          <label style={{fontSize:11,fontWeight:600,color:T.subColor,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
            Keterangan / Kejadian
          </label>
          <textarea value={keterangan} onChange={e=>setKeterangan(e.target.value)}
            placeholder="Tulis kejadian atau kondisi (opsional)" rows={3}
            style={{width:"100%",background:isDark ? "rgba(255,255,255,0.05)" : "#f8faff",border:`1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#d1daf7"}`,borderRadius:10,padding:"12px 14px",color:T.titleColor,fontSize:14,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",lineHeight:1.5}}
            onFocus={e=>e.target.style.border=`1px solid ${isDark ? "#60a5fa" : "#2563eb"}`}
            onBlur={e=>e.target.style.border=`1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#d1daf7"}`}
          />
        </div>
      </div>

      {scanning && (
        <div style={{position:"relative",borderRadius:16,overflow:"hidden",marginBottom:16,background:"#000",aspectRatio:"4/3"}}>
          <video ref={videoRef} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} playsInline muted autoPlay />
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"relative",width:200,height:200}}>
              {[
                {top:0,left:0,borderTop:"3px solid #3b82f6",borderLeft:"3px solid #3b82f6"},
                {top:0,right:0,borderTop:"3px solid #3b82f6",borderRight:"3px solid #3b82f6"},
                {bottom:0,left:0,borderBottom:"3px solid #3b82f6",borderLeft:"3px solid #3b82f6"},
                {bottom:0,right:0,borderBottom:"3px solid #3b82f6",borderRight:"3px solid #3b82f6"},
              ].map((s,i)=><div key={i} style={{position:"absolute",width:30,height:30,...s}}/>)}
              <div style={{position:"absolute",left:0,right:0,height:2,background:"rgba(59,130,246,0.8)",animation:"scanline 2s linear infinite",top:0}}/>
            </div>
          </div>
          <div style={{position:"absolute",bottom:16,left:0,right:0,textAlign:"center"}}>
            <span style={{background:"rgba(0,0,0,0.6)",color:"#93c5fd",fontSize:12,padding:"6px 16px",borderRadius:20}}>
              Arahkan ke QR Code patroli
            </span>
          </div>
          <button onClick={stopCamera} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.7)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"white",padding:"6px 14px",fontSize:12,cursor:"pointer"}}>
            ✕ Batal
          </button>
        </div>
      )}

      <style>{`
        @keyframes scanline { 0%{top:0} 100%{top:196px} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {status && <StatusChip tipe={status.tipe} pesan={status.pesan} theme={theme} />}

      {hasilScan && (
        <div style={{
          background: isDark ? "rgba(34,197,94,0.08)" : "rgba(22,163,74,0.08)",
          border: isDark ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(22,163,74,0.3)",
          borderRadius:16,padding:20,marginTop:16
        }}>
          <div style={{fontSize:11,fontWeight:700,color: isDark ? "#4ade80" : "#16a34a",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>✅ Berhasil Tercatat di Spreadsheet</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["Titik",hasilScan.namaTitik],["Jarak",`${hasilScan.jarak} m`],["Waktu",hasilScan.jam],["Sesi",hasilScan.sesi]].map(([k,v])=>(
              <div key={k} style={{background:isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9",borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:T.subColor,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{k}</div>
                <div style={{fontSize:14,fontWeight:600,color:T.titleColor}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:10,color:isDark ? "#475569" : "#94a3b8",marginTop:12,textAlign:"center",fontFamily:"monospace"}}>{hasilScan.id}</div>
        </div>
      )}

      {!scanning && (
        <button onClick={mulaiScan} disabled={loading}
          style={{width:"100%",marginTop:20,padding:"16px",background:loading? (isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.3)"):"linear-gradient(135deg,#2563eb,#7c3aed)",border:"none",borderRadius:14,color:"white",fontSize:16,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:loading?"none":"0 4px 24px rgba(37,99,235,0.4)",fontFamily:"inherit"}}>
          {loading ? (
            <span style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block"}}/>
              Memproses...
            </span>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M22 5h-6v6h6V5zm-6 8h1.5v1.5H16V13zm1.5 1.5H19V16h-1.5v-1.5zM19 13h1.5v1.5H19V13zm-3 3h1.5v1.5H16V16zm1.5 1.5H19V19h-1.5v-1.5zM19 16h1.5v1.5H19V16zm1.5-1.5H22V16h-1.5v-1.5zm0 3H22V19h-1.5v-1.5z"/>
              </svg>
              SCAN QR CODE PATROLI
            </>
          )}
        </button>
      )}

      <div style={{marginTop:16,padding:"12px 16px",background:isDark ? "rgba(255,255,255,0.02)" : "#f8faff",border:`1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,borderRadius:10,display:"flex",alignItems:"center",gap:10}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill={T.subColor}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span style={{fontSize:12,color:T.subColor,lineHeight:1.5}}>
          Maksimal jarak scan: <strong style={{color:T.titleColor}}>{JARAK_MAKS} meter</strong> dari titik QR Code.
        </span>
      </div>
    </div>
  );
}