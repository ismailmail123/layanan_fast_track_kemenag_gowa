import { useState, useRef, useEffect, useCallback } from "react";
import { encodeBarcode } from "../utils/index";

const PASSCODE_CONFIG = {
  code: "1234",
  maxAttempts: 3,
  lockoutSeconds: 60,
  sessionKey: "sipatroli_gen_auth"
};

const TITIK_DEFAULT = [
];

// ── Passcode Guard ───────────────────────────────────────
function PasscodeGuard({ onUnlock, theme }) {
  const [input, setInput]          = useState("");
  const [attempts, setAttempts]    = useState(0);
  const [lockoutUntil, setLockout] = useState(null);
  const [timeLeft, setTimeLeft]    = useState(0);
  const [shake, setShake]          = useState(false);
  const [success, setSuccess]      = useState(false);
  const inputRef                   = useRef(null);
  const isDark                     = theme === "dark";

  useEffect(() => {
    if (!lockoutUntil) return;
    const iv = setInterval(() => {
      const rem = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setTimeLeft(rem);
      if (rem === 0) { setLockout(null); setAttempts(0); }
    }, 500);
    return () => clearInterval(iv);
  }, [lockoutUntil]);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);

  const handleDigit = (digit) => {
    if (lockoutUntil || input.length >= 6) return;
    const next = input + digit;
    setInput(next);
    if (next.length === PASSCODE_CONFIG.code.length) setTimeout(() => checkPasscode(next), 100);
  };

  const handleDelete = () => setInput(p => p.slice(0, -1));

  const checkPasscode = (code) => {
    if (code === PASSCODE_CONFIG.code) {
      setSuccess(true);
      setTimeout(() => {
        try { localStorage.setItem(PASSCODE_CONFIG.sessionKey, String(Date.now() + 8 * 3600 * 1000)); } catch (err) {console.error("Gagal menyimpan sesi:", err);}
        onUnlock();
      }, 600);
    } else {
      const na = attempts + 1;
      setAttempts(na);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
      if (na >= PASSCODE_CONFIG.maxAttempts) {
        setTimeout(() => { setLockout(Date.now() + PASSCODE_CONFIG.lockoutSeconds * 1000); setTimeLeft(PASSCODE_CONFIG.lockoutSeconds); }, 0);
      }
    }
  };

  const locked = Boolean(lockoutUntil);
  const c = isDark
    ? { card: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", text: "#f1f5f9", sub: "#64748b", dot: "#1e293b", dotFill: "#3b82f6", btn: "rgba(255,255,255,0.06)", btnBorder: "rgba(255,255,255,0.1)", btnText: "#e2e8f0", del: "rgba(239,68,68,0.12)", delText: "#f87171" }
    : { card: "white", border: "#e2e8f0", text: "#1e293b", sub: "#94a3b8", dot: "#e9eef8", dotFill: "#3b82f6", btn: "white", btnBorder: "#dde5f3", btnText: "#334155", del: "#fff1f2", delText: "#ef4444" };

  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
      <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 24, padding: "32px 28px", width: "100%", maxWidth: 340, boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.4)" : "0 20px 60px rgba(0,0,0,0.08)", animation: shake ? "shake 0.4s ease" : success ? "successPop 0.4s ease" : "none" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: locked ? "rgba(239,68,68,0.12)" : success ? "rgba(34,197,94,0.12)" : "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(139,92,246,0.15))", border: locked ? "1px solid rgba(239,68,68,0.3)" : success ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(59,130,246,0.25)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 14, transition: "all 0.3s" }}>
            {locked ? "🔒" : success ? "✅" : "🔐"}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: c.text }}>{locked ? "Akses Terkunci" : success ? "Akses Diberikan" : "Masukkan Passcode"}</div>
          <div style={{ fontSize: 12, color: c.sub, marginTop: 6, lineHeight: 1.5 }}>
            {locked ? `Tunggu ${timeLeft} detik sebelum mencoba lagi` : success ? "Mengalihkan ke Generator..." : "Halaman Generator QR membutuhkan passcode"}
          </div>
        </div>

        {!locked && !success && (
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28 }}>
            {Array.from({ length: PASSCODE_CONFIG.code.length }).map((_, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: i < input.length ? c.dotFill : c.dot, border: `2px solid ${i < input.length ? c.dotFill : isDark ? "rgba(255,255,255,0.12)" : "#d1daf7"}`, transition: "all 0.15s", transform: i < input.length ? "scale(1.15)" : "scale(1)" }} />
            ))}
          </div>
        )}

        {!locked && !success && attempts > 0 && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "8px 14px", marginBottom: 18, fontSize: 11, color: "#f87171", textAlign: "center" }}>
            ⚠️ Passcode salah — {PASSCODE_CONFIG.maxAttempts - attempts} percobaan tersisa
          </div>
        )}

        {locked && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ height: 6, background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(timeLeft / PASSCODE_CONFIG.lockoutSeconds) * 100}%`, background: "linear-gradient(90deg,#ef4444,#f97316)", borderRadius: 3, transition: "width 0.5s linear" }} />
            </div>
            <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#f87171", marginTop: 10 }}>{timeLeft}s</div>
          </div>
        )}

        {!locked && !success && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => {
              const isDel = d === "⌫", isEmpty = d === "";
              return (
                <button key={i} onClick={() => isEmpty ? null : isDel ? handleDelete() : handleDigit(d)} disabled={isEmpty}
                  style={{ height: 56, borderRadius: 14, border: isDel ? `1px solid rgba(239,68,68,0.25)` : `1px solid ${c.btnBorder}`, background: isDel ? c.del : isEmpty ? "transparent" : c.btn, color: isDel ? c.delText : c.btnText, fontSize: isDel ? 18 : 20, fontWeight: 600, cursor: isEmpty ? "default" : "pointer", transition: "all 0.1s", boxShadow: isEmpty || isDark ? "none" : "0 2px 6px rgba(0,0,0,0.06)", opacity: isEmpty ? 0 : 1 }}>
                  {d}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}@keyframes successPop{0%{transform:scale(1)}50%{transform:scale(1.03)}100%{transform:scale(1)}}`}</style>
    </div>
  );
}

// ── Cek sesi ─────────────────────────────────────────────
function checkSession() {
  try { const exp = localStorage.getItem(PASSCODE_CONFIG.sessionKey); if (exp && Date.now() < parseInt(exp)) return true; } catch (err) { console.error("Gagal memeriksa sesi:", err); }
  return false;
}

// ── InputTitik ───────────────────────────────────────────
const InputTitik = ({ label, value, onChange, placeholder, type = "text", theme }) => {
  const isDark = theme === "dark";
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 10, fontWeight: 600, color: isDark ? "#94a3b8" : "#64748b", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        step={type === "number" ? "0.000000000001" : undefined}
        style={{ width: "100%", background: isDark ? "rgba(255,255,255,0.05)" : "white", border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #dde5f3", borderRadius: 8, padding: "10px 12px", color: isDark ? "#f1f5f9" : "#1e293b", fontSize: 13, outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );
};

// // ── Card QR Code per titik ───────────────────────────────
// const TitikCard = ({ titik, onHapus, index, theme }) => {
//   const isDark = theme === "dark";
//   const canvasRef = useRef(null);
//   const downloadCanvasRef = useRef(null);
//   const encoded = encodeBarcode(titik.nama, titik.lat, titik.lng);
//   const [qrReady, setQrReady] = useState(false);

//   // Fungsi untuk generate QR menggunakan canvas langsung
//   const generateQR = useCallback((canvasElement, size, data) => {
//     if (!canvasElement) return Promise.resolve(false);
    
//     return new Promise((resolve) => {
//       try {
//         // Bersihkan canvas
//         const ctx = canvasElement.getContext('2d');
//         canvasElement.width = size;
//         canvasElement.height = size;
//         ctx.fillStyle = '#ffffff';
//         ctx.fillRect(0, 0, size, size);
        
//         const qrData = data;
        
//         if (!window.QRCodeLib) {
//           const script = document.createElement('script');
//           script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
//           script.onload = () => {
//             window.QRCodeLib = window.QRCode;
//             window.QRCodeLib.toCanvas(canvasElement, qrData, {
//               width: size,
//               margin: 4,  // Tambah margin biar mudah discan
//               color: {
//                 dark: '#000000',
//                 light: '#ffffff'
//               },
//               errorCorrectionLevel: 'L'  // Ganti ke Low agar modul lebih besar
//             }, (error) => {
//               if (error) {
//                 console.error('QR Error:', error);
//                 resolve(false);
//               } else {
//                 resolve(true);
//               }
//             });
//           };
//           document.head.appendChild(script);
//         } else {
//           window.QRCodeLib.toCanvas(canvasElement, qrData, {
//             width: size,
//             margin: 4,
//             color: {
//               dark: '#000000',
//               light: '#ffffff'
//             },
//             errorCorrectionLevel: 'L'
//           }, (error) => {
//             if (error) {
//               console.error('QR Error:', error);
//               resolve(false);
//             } else {
//               resolve(true);
//             }
//           });
//         }
//       } catch (err) {
//         console.error('Gagal generate QR:', err);
//         resolve(false);
//       }
//     });
//   }, []);

//   // Render QR
//   useEffect(() => {
//     const renderQRs = async () => {
//       if (canvasRef.current) {
//         const success = await generateQR(canvasRef.current, 200, encoded); // Ukuran preview jadi 200px
//         if (success) setQrReady(true);
//       }
      
//       if (downloadCanvasRef.current) {
//         await generateQR(downloadCanvasRef.current, 1000, encoded); // Ukuran download 1000px
//       }
//     };
    
//     renderQRs();
//   }, [generateQR, encoded]);

//   const downloadQR = () => {
//     if (!downloadCanvasRef.current) {
//       alert("QR Code belum siap");
//       return;
//     }
    
//     try {
//       const link = document.createElement("a");
//       link.download = `QR-Patroli-${titik.nama.replace(/\s+/g, "-")}.png`;
//       link.href = downloadCanvasRef.current.toDataURL("image/png");
//       link.click();
//     } catch (err) {
//       console.error("Gagal download:", err);
//       alert("Gagal mendownload QR Code");
//     }
//   };

//   return (
//     <div style={{
//       background: isDark ? "rgba(255,255,255,0.03)" : "white",
//       border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e9eef8",
//       borderRadius: 14,
//       padding: 16,
//       marginBottom: 12,
//       boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.05)"
//     }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
//         <div>
//           <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? "#f1f5f9" : "#1e293b" }}>
//             📍 {titik.nama}
//           </div>
//           <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
//             {Number(titik.lat).toFixed(12)}, {Number(titik.lng).toFixed(12)}
//           </div>
//         </div>
//         <div style={{ display: "flex", gap: 6 }}>
//           <button onClick={downloadQR} style={{
//             background: "rgba(59,130,246,0.12)",
//             border: "1px solid rgba(59,130,246,0.3)",
//             borderRadius: 8,
//             color: "#60a5fa",
//             padding: "5px 12px",
//             fontSize: 11,
//             cursor: "pointer",
//             fontWeight: 600
//           }}>
//             ⬇ Unduh
//           </button>
//           <button onClick={() => onHapus(index)} style={{
//             background: "rgba(239,68,68,0.1)",
//             border: "1px solid rgba(239,68,68,0.2)",
//             borderRadius: 8,
//             color: "#f87171",
//             padding: "5px 10px",
//             fontSize: 11,
//             cursor: "pointer"
//           }}>✕</button>
//         </div>
//       </div>

//       <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//         <div style={{ background: "white", borderRadius: 10, padding: 8, flexShrink: 0 }}>
//           <canvas 
//             ref={canvasRef} 
//             width={200} 
//             height={200} 
//             style={{ width: 200, height: 200, display: 'block' }}
//           />
//         </div>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
//             Data Terenkripsi (Base64)
//           </div>
//           <div style={{
//             background: isDark ? "rgba(0,0,0,0.3)" : "#f1f5f9",
//             borderRadius: 8,
//             padding: "8px 10px",
//             fontSize: 9,
//             color: "#4ade80",
//             fontFamily: "monospace",
//             wordBreak: "break-all",
//             lineHeight: 1.6,
//             maxHeight: 80,
//             overflow: "auto"
//           }}>
//             {encoded}
//           </div>
//           <div style={{ fontSize: 10, color: "#475569", marginTop: 8, lineHeight: 1.5 }}>
//             ✅ Terenkripsi Base64<br/>
//             📏 Radius scan: 5 meter
//           </div>
//         </div>
//       </div>

//       <canvas 
//         ref={downloadCanvasRef} 
//         width={1000} 
//         height={1000} 
//         style={{ display: 'none' }}
//       />
//     </div>
//   );
// };
// ── Card QR Code per titik ───────────────────────────────
const TitikCard = ({ titik, onHapus, index, theme }) => {
  const isDark = theme === "dark";
  const canvasRef = useRef(null);
  const downloadCanvasRef = useRef(null);
  const encoded = encodeBarcode(titik.nama, titik.lat, titik.lng);
  const [qrReady, setQrReady] = useState(false);

  // Fungsi untuk generate QR menggunakan canvas langsung
  const generateQR = useCallback((canvasElement, size, data) => {
    if (!canvasElement) return Promise.resolve(false);
    
    return new Promise((resolve) => {
      try {
        const ctx = canvasElement.getContext('2d');
        canvasElement.width = size;
        canvasElement.height = size;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        
        const qrData = data;
        
        if (!window.QRCodeLib) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
          script.onload = () => {
            window.QRCodeLib = window.QRCode;
            window.QRCodeLib.toCanvas(canvasElement, qrData, {
              width: size,
              margin: 4,
              color: {
                dark: '#000000',
                light: '#ffffff'
              },
              errorCorrectionLevel: 'L'
            }, (error) => {
              if (error) {
                console.error('QR Error:', error);
                resolve(false);
              } else {
                resolve(true);
              }
            });
          };
          document.head.appendChild(script);
        } else {
          window.QRCodeLib.toCanvas(canvasElement, qrData, {
            width: size,
            margin: 4,
            color: {
              dark: '#000000',
              light: '#ffffff'
            },
            errorCorrectionLevel: 'L'
          }, (error) => {
            if (error) {
              console.error('QR Error:', error);
              resolve(false);
            } else {
              resolve(true);
            }
          });
        }
      } catch (err) {
        console.error('Gagal generate QR:', err);
        resolve(false);
      }
    });
  }, []);

  // Render QR
  useEffect(() => {
    const renderQRs = async () => {
      if (canvasRef.current) {
        const success = await generateQR(canvasRef.current, 200, encoded);
        if (success) setQrReady(true);
      }
      
      if (downloadCanvasRef.current) {
        await generateQR(downloadCanvasRef.current, 1000, encoded);
      }
    };
    
    renderQRs();
  }, [generateQR, encoded]);

  const downloadQR = () => {
    if (!downloadCanvasRef.current) {
      alert("QR Code belum siap");
      return;
    }
    
    try {
      // Buat canvas baru untuk hasil akhir dengan desain
      const finalCanvas = document.createElement("canvas");
      const ctx = finalCanvas.getContext("2d");
      
      // Ukuran QR 1000px + padding untuk teks
      const qrSize = 1000;
      const textHeight = 70;
      const padding = 40;
      
      finalCanvas.width = qrSize + (padding * 2);
      finalCanvas.height = qrSize + textHeight + (padding * 2);
      
      // Background putih
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      // Gambar QR code di tengah
      const qrImage = downloadCanvasRef.current;
      ctx.drawImage(qrImage, padding, padding, qrSize, qrSize);
      
      // ── Desain teks nama titik di bawah ──
      const namaTitik = titik.nama;
      
      // Garis pemisah elegan
      const lineY = padding + qrSize + 20;
      ctx.beginPath();
      ctx.strokeStyle = "#d4d4d8";
      ctx.lineWidth = 1.5;
      ctx.moveTo(padding + 80, lineY);
      ctx.lineTo(finalCanvas.width - padding - 80, lineY);
      ctx.stroke();
      
      // Icon lokasi
      ctx.font = "28px 'Segoe UI', system-ui";
      ctx.fillStyle = "#3b82f6";
      ctx.fillText("📍", padding + 100, lineY + 38);
      
      // Nama titik (bold, besar)
      ctx.font = "bold 32px 'Segoe UI', system-ui";
      ctx.fillStyle = "#1e293b";
      ctx.fillText(namaTitik, padding + 155, lineY + 35);
      
      // Tambahan badge "QR Patroli" di pojok kanan bawah
      ctx.font = "11px 'Segoe UI', system-ui";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("SIPATROLI • QR CODE PATROLI", finalCanvas.width - padding - 170, finalCanvas.height - padding + 12);
      
      // Download
      const link = document.createElement("a");
      link.download = `QR-Patroli-${titik.nama.replace(/\s+/g, "-")}.png`;
      link.href = finalCanvas.toDataURL("image/png");
      link.click();
      
    } catch (err) {
      console.error("Gagal download:", err);
      alert("Gagal mendownload QR Code");
    }
  };

  return (
    <div style={{
      background: isDark ? "rgba(255,255,255,0.03)" : "white",
      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e9eef8",
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.05)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? "#f1f5f9" : "#1e293b" }}>
            📍 {titik.nama}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
            {Number(titik.lat).toFixed(12)}, {Number(titik.lng).toFixed(12)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={downloadQR} style={{
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 8,
            color: "#60a5fa",
            padding: "5px 12px",
            fontSize: 11,
            cursor: "pointer",
            fontWeight: 600
          }}>
            ⬇ Unduh
          </button>
          <button onClick={() => onHapus(index)} style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8,
            color: "#f87171",
            padding: "5px 10px",
            fontSize: 11,
            cursor: "pointer"
          }}>✕</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ background: "white", borderRadius: 10, padding: 8, flexShrink: 0 }}>
          <canvas 
            ref={canvasRef} 
            width={200} 
            height={200} 
            style={{ width: 200, height: 200, display: 'block' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            Data Terenkripsi (Base64)
          </div>
          <div style={{
            background: isDark ? "rgba(0,0,0,0.3)" : "#f1f5f9",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 9,
            color: "#4ade80",
            fontFamily: "monospace",
            wordBreak: "break-all",
            lineHeight: 1.6,
            maxHeight: 80,
            overflow: "auto"
          }}>
            {encoded}
          </div>
          <div style={{ fontSize: 10, color: "#475569", marginTop: 8, lineHeight: 1.5 }}>
            ✅ Terenkripsi Base64<br/>
            📏 Radius scan: 5 meter
          </div>
        </div>
      </div>

      <canvas 
        ref={downloadCanvasRef} 
        width={1000} 
        height={1000} 
        style={{ display: 'none' }}
      />
    </div>
  );
};




// ── Konstanta GPS averaging ──────────────────────────────
const GPS_SAMPLES_TARGET = 8;
const GPS_ACCURACY_MAX   = 15;
const GPS_TIMEOUT_MS     = 20000;

// ── GeneratorContent ─────────────────────────────────────
function GeneratorContent({ theme, onLock }) {
  const isDark = theme === "dark";
  const [daftarTitik, setDaftarTitik] = useState(TITIK_DEFAULT);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({ nama: "", lat: "", lng: "" });
  const [errorForm, setErrorForm]     = useState("");
  const [gpsPhase, setGpsPhase]       = useState("idle");
  const [gpsSamples, setGpsSamples]   = useState([]);
  const [gpsMessage, setGpsMessage]   = useState("");
  const [gpsBestAccuracy, setGpsBestAccuracy] = useState(null);
  const watchIdRef  = useRef(null);
  const samplesRef  = useRef([]);
  const timeoutRef  = useRef(null);

  const stopGPS = () => {
    if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  };

  useEffect(() => () => stopGPS(), []);

  

  const finalizeSamples = (samples) => {
    stopGPS();
    if (samples.length === 0) { setGpsPhase("error"); setGpsMessage("Tidak ada sampel GPS yang cukup akurat. Coba di luar ruangan."); return; }
    const sorted  = [...samples].sort((a, b) => a.accuracy - b.accuracy);
    const topHalf = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2)));
    const avgLat  = topHalf.reduce((s, p) => s + p.lat, 0) / topHalf.length;
    const avgLng  = topHalf.reduce((s, p) => s + p.lng, 0) / topHalf.length;
    const bestAcc = Math.round(sorted[0].accuracy);
    setForm(f => ({ ...f, lat: avgLat.toFixed(12), lng: avgLng.toFixed(12) }));
    setGpsBestAccuracy(bestAcc);
    setGpsPhase("done");
    setGpsMessage(`Dirata-rata dari ${topHalf.length} sampel terbaik (dari ${samples.length} total) — akurasi terbaik ±${bestAcc}m`);
  };

  const detectGPS = () => {
    if (!navigator.geolocation) { setGpsPhase("error"); setGpsMessage("Browser ini tidak mendukung geolokasi."); return; }
    stopGPS();
    samplesRef.current = [];
    setGpsSamples([]);
    setGpsBestAccuracy(null);
    setGpsPhase("warmup");
    setGpsMessage("Menghubungkan ke GPS perangkat...");

    let isWarmup = true;
    const warmupTimer = setTimeout(() => { isWarmup = false; setGpsPhase("sampling"); }, 3000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        if (isWarmup) { setGpsMessage(`Warming up GPS... akurasi saat ini ±${Math.round(accuracy)}m`); return; }
        if (accuracy <= GPS_ACCURACY_MAX) {
          const newSample = { lat, lng, accuracy };
          samplesRef.current = [...samplesRef.current, newSample];
          setGpsSamples([...samplesRef.current]);
          setGpsMessage(`Mengumpulkan sampel ${samplesRef.current.length}/${GPS_SAMPLES_TARGET} — akurasi ±${Math.round(accuracy)}m`);
          if (samplesRef.current.length >= GPS_SAMPLES_TARGET) finalizeSamples(samplesRef.current);
        } else {
          setGpsMessage(`Menunggu sinyal lebih kuat... ±${Math.round(accuracy)}m (target ≤${GPS_ACCURACY_MAX}m)`);
        }
      },
      (err) => {
        clearTimeout(warmupTimer); stopGPS();
        const msgs = { 1: "Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser.", 2: "Lokasi tidak dapat ditentukan. Pastikan GPS aktif.", 3: "Waktu habis. Coba lagi di area dengan sinyal GPS lebih baik." };
        setGpsPhase("error"); setGpsMessage(msgs[err.code] || "Gagal mendeteksi lokasi.");
      },
      { enableHighAccuracy: true, timeout: GPS_TIMEOUT_MS, maximumAge: 0 }
    );

    timeoutRef.current = setTimeout(() => {
      clearTimeout(warmupTimer);
      if (samplesRef.current.length > 0) { finalizeSamples(samplesRef.current); }
      else { stopGPS(); setGpsPhase("error"); setGpsMessage("Waktu habis tanpa sampel akurat. Coba di luar ruangan atau pindah ke area terbuka."); }
    }, GPS_TIMEOUT_MS);
  };

  const cancelGPS     = () => { stopGPS(); setGpsPhase("idle"); setGpsSamples([]); setGpsMessage(""); };
  const resetGPSState = () => { stopGPS(); setGpsPhase("idle"); setGpsSamples([]); setGpsMessage(""); setGpsBestAccuracy(null); };

  const tambahTitik = () => {
    if (!form.nama.trim()) { setErrorForm("Nama titik wajib diisi"); return; }
    const lat = parseFloat(form.lat), lng = parseFloat(form.lng);
    if (isNaN(lat) || isNaN(lng))   { setErrorForm("Latitude dan longitude harus berupa angka"); return; }
    if (lat < -90  || lat > 90)     { setErrorForm("Latitude harus antara -90 dan 90"); return; }
    if (lng < -180 || lng > 180)    { setErrorForm("Longitude harus antara -180 dan 180"); return; }
    setDaftarTitik(prev => [...prev, { nama: form.nama.trim(), lat, lng }]);
    setForm({ nama: "", lat: "", lng: "" });
    setShowForm(false); setErrorForm(""); resetGPSState();
  };

  const hapusTitik = (idx) => setDaftarTitik(prev => prev.filter((_, i) => i !== idx));

  const sampleProgress = Math.min((gpsSamples.length / GPS_SAMPLES_TARGET) * 100, 100);
  const isGPSActive    = gpsPhase === "warmup" || gpsPhase === "sampling";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: isDark ? "#f1f5f9" : "#1e293b" }}>Generator QR Patroli</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>Buat QR Code terenkripsi untuk setiap titik</p>
        </div>
        <button onClick={() => { try { localStorage.removeItem(PASSCODE_CONFIG.sessionKey); } catch (err) { console.error("Gagal menghapus sesi:", err); } onLock(); }}
          style={{ background: isDark ? "rgba(239,68,68,0.1)" : "#fff1f2", border: isDark ? "1px solid rgba(239,68,68,0.2)" : "1px solid #fecdd3", borderRadius: 10, color: "#f87171", padding: "7px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
          🔒 Kunci
        </button>
      </div>

      {/* Info */}
      <div style={{ background: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 12, color: isDark ? "#93c5fd" : "#2563eb", lineHeight: 1.7 }}>
        <strong style={{ color: isDark ? "#60a5fa" : "#1d4ed8" }}>📋 Cara Penggunaan:</strong><br/>
        1. Tambah titik patroli dengan nama dan koordinat GPS<br/>
        2. Unduh QR Code masing-masing titik<br/>
        3. Cetak dan pasang QR Code di titik yang ditentukan<br/>
        4. Data dalam QR Code terenkripsi Base64 — tidak bisa dimanipulasi
      </div>

      {/* Tombol Tambah */}
      <button
        onClick={() => { const next = !showForm; setShowForm(next); if (!next) { resetGPSState(); setErrorForm(""); } }}
        style={{ width: "100%", padding: "13px", background: showForm ? (isDark ? "rgba(255,255,255,0.05)" : "#f8faff") : "linear-gradient(135deg,#1d4ed8,#6d28d9)", border: showForm ? `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#dde5f3"}` : "none", borderRadius: 12, color: showForm ? (isDark ? "#f1f5f9" : "#334155") : "white", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: showForm ? "none" : "0 4px 20px rgba(29,78,216,0.35)" }}>
        {showForm ? "✕ Batal" : "+ Tambah Titik Baru"}
      </button>

      {/* Form Tambah */}
      {showForm && (
        <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "white", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e9eef8", borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: isDark ? "none" : "0 4px 16px rgba(0,0,0,0.06)" }}>
          <InputTitik label="Nama Titik" value={form.nama} onChange={v => setForm(f => ({ ...f, nama: v }))} placeholder="cth: Blok D - Kamar 31-40" theme={theme} />

          {/* GPS Panel */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: isDark ? "#94a3b8" : "#64748b", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Koordinat GPS</label>

            {!isGPSActive && gpsPhase !== "done" && (
              <button onClick={detectGPS} style={{ width: "100%", padding: "10px 14px", background: isDark ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 10, color: "#60a5fa", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                📍 Deteksi lokasi akurat (GPS averaging)
              </button>
            )}

            {isGPSActive && (
              <div style={{ background: isDark ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 12, color: "#60a5fa", marginBottom: 10, lineHeight: 1.5 }}>
                  {gpsPhase === "warmup" ? "🛰️ " : "📡 "}{gpsMessage}
                </div>
                {gpsPhase === "sampling" && (
                  <>
                    <div style={{ height: 6, borderRadius: 3, overflow: "hidden", background: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0", marginBottom: 6 }}>
                      <div style={{ height: "100%", width: `${sampleProgress}%`, background: "linear-gradient(90deg,#3b82f6,#6366f1)", borderRadius: 3, transition: "width 0.3s ease" }} />
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", marginBottom: 10 }}>{gpsSamples.length} / {GPS_SAMPLES_TARGET} sampel terkumpul</div>
                  </>
                )}
                <button onClick={cancelGPS} style={{ width: "100%", padding: "7px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#f87171", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>✕ Batalkan</button>
              </div>
            )}

            {gpsPhase === "done" && (
              <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 12, color: "#4ade80", marginBottom: 8, lineHeight: 1.5 }}>✅ {gpsMessage}</div>
                <button onClick={detectGPS} style={{ padding: "6px 12px", fontSize: 11, fontWeight: 600, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #dde5f3", borderRadius: 7, color: isDark ? "#94a3b8" : "#64748b", cursor: "pointer" }}>🔄 Ulangi deteksi</button>
              </div>
            )}

            {gpsPhase === "error" && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 12, color: "#f87171", marginBottom: 8, lineHeight: 1.5 }}>⚠️ {gpsMessage}</div>
                <button onClick={detectGPS} style={{ padding: "6px 12px", fontSize: 11, fontWeight: 600, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 7, color: "#f87171", cursor: "pointer" }}>🔄 Coba lagi</button>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <InputTitik label="Latitude"  value={form.lat} onChange={v => setForm(f => ({ ...f, lat: v }))} placeholder="-5.147700000000" type="number" theme={theme} />
            <InputTitik label="Longitude" value={form.lng} onChange={v => setForm(f => ({ ...f, lng: v }))} placeholder="119.432700000000" type="number" theme={theme} />
          </div>

          <div style={{ fontSize: 11, color: "#64748b", background: isDark ? "rgba(255,255,255,0.02)" : "#f8faff", borderRadius: 8, padding: "8px 12px", marginBottom: 14, lineHeight: 1.6 }}>
            💡 <strong style={{ color: isDark ? "#94a3b8" : "#475569" }}>Tip:</strong> Gunakan GPS averaging untuk akurasi optimal. Berdiri diam di titik fisik saat proses berlangsung (~20 detik). Atau isi koordinat manual dari Google Maps.
          </div>

          {errorForm && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#f87171", fontSize: 12, marginBottom: 12 }}>⚠️ {errorForm}</div>
          )}

          <button onClick={tambahTitik} style={{ width: "100%", padding: "12px", background: "#1d4ed8", border: "none", borderRadius: 10, color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            ✅ Buat QR Code
          </button>
        </div>
      )}

      <div style={{ marginBottom: 8, fontSize: 12, color: "#64748b" }}>{daftarTitik.length} titik patroli terdaftar</div>

      {daftarTitik.map((titik, i) => (
        <TitikCard key={i} titik={titik} onHapus={hapusTitik} index={i} theme={theme} />
      ))}
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────
export default function GeneratorPage({ theme = "dark" }) {
  const [unlocked, setUnlocked] = useState(() => checkSession());
  return unlocked
    ? <GeneratorContent theme={theme} onLock={() => setUnlocked(false)} />
    : <PasscodeGuard theme={theme} onUnlock={() => setUnlocked(true)} />;
}