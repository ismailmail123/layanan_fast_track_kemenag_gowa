
import { useState, useRef, useEffect } from "react";
import { hitungJarak, dapatkanPosisi, getSesiSaatIni, formatWaktu, formatTanggalPendek } from "../utils/index";
import { APPS_SCRIPT_URL } from "../App";

const JARAK_MAKS = 5;

// ── Decode QR ────────────────────────────────────────────
const decodeBarcodeFlexibel = (rawText) => {
  // Method 1: JSON langsung
  try {
    const p = JSON.parse(rawText);
    if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
      return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
  } catch (err) { console.warn("Bukan JSON langsung:", err.message); }

  // Method 2: Base64
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

  // Method 3: URI JSON
  try {
    const p = JSON.parse(decodeURIComponent(rawText));
    if (p.nama && p.latitude !== undefined && p.longitude !== undefined)
      return { nama: p.nama, latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) };
  } catch (err) { console.warn("Bukan JSON URI:", err.message); }

  // Method 4: pipe langsung
  const parts = rawText.split("|");
  if (parts.length === 3) {
    const lat = parseFloat(parts[1]), lng = parseFloat(parts[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { nama: parts[0], latitude: lat, longitude: lng };
  }

  return null;
};

// ── Generate ID lokal ────────────────────────────────────
const buatId = (now) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `PTR-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

// ── JSONP: satu-satunya cara reliable kirim data ke GAS ──
// fetch() no-cors maupun cors tidak bisa ikuti redirect GAS.
// <script src="..."> mengikuti redirect secara native → data masuk spreadsheet.
const simpanDataJSONP = (payload) => {
  return new Promise((resolve, reject) => {
    // Nama callback unik agar tidak bentrok jika dipanggil berulang
    const cbName = `gasCallback_${Date.now()}`;

    // Timeout 15 detik
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Timeout: GAS tidak merespons dalam 15 detik"));
    }, 15000);

    const cleanup = () => {
      clearTimeout(timer);
      delete window[cbName];
      const el = document.getElementById(cbName);
      if (el) el.remove();
    };

    // GAS akan memanggil window[cbName](responseJson)
    window[cbName] = (data) => {
      cleanup();
      if (data && data.success) {
        resolve(data);
      } else {
        reject(new Error(data?.message || "GAS melaporkan kegagalan"));
      }
    };

    const params = new URLSearchParams({
      action:       "savePatrol",
      callback:     cbName,           // ← GAS akan membungkus response dengan ini
      namaPetugas:  payload.namaPetugas,
      keterangan:   payload.keterangan,
      namaTitik:    payload.namaTitik,
      latTitik:     payload.latTitik,
      lngTitik:     payload.lngTitik,
      latPetugas:   payload.latPetugas,
      lngPetugas:   payload.lngPetugas,
      jarak:        payload.jarak,
      timestamp:    payload.timestamp,
      status:       payload.status,
    });

    const script = document.createElement("script");
    script.id  = cbName;
    script.src = `${APPS_SCRIPT_URL}?${params.toString()}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("Gagal memuat script JSONP (jaringan/URL salah)"));
    };

    document.head.appendChild(script);
    console.log("📤 JSONP request dikirim:", script.src);
  });
};



// ── Komponen ─────────────────────────────────────────────
const StatusChip = ({ tipe, pesan }) => {
  const w = {
    error:   { bg:"rgba(239,68,68,0.15)",  br:"rgba(239,68,68,0.4)",  tx:"#f87171", ic:"⚠️" },
    sukses:  { bg:"rgba(34,197,94,0.15)",  br:"rgba(34,197,94,0.4)",  tx:"#4ade80", ic:"✅" },
    info:    { bg:"rgba(59,130,246,0.15)", br:"rgba(59,130,246,0.4)", tx:"#60a5fa", ic:"ℹ️" },
    warning: { bg:"rgba(234,179,8,0.15)",  br:"rgba(234,179,8,0.4)",  tx:"#facc15", ic:"🔴" },
  }[tipe] || {};
  return (
    <div style={{background:w.bg,border:`1px solid ${w.br}`,borderRadius:10,padding:"12px 16px",color:w.tx,fontSize:13,fontWeight:500,display:"flex",alignItems:"flex-start",gap:10,marginTop:12}}>
      <span style={{fontSize:16,flexShrink:0}}>{w.ic}</span>
      <span style={{lineHeight:1.6,whiteSpace:"pre-line"}}>{pesan}</span>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, required }) => (
  <div style={{marginBottom:14}}>
    <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
      {label} {required && <span style={{color:"#f87171"}}>*</span>}
    </label>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box"}}
      onFocus={e=>e.target.style.border="1px solid rgba(96,165,250,0.6)"}
      onBlur={e=>e.target.style.border="1px solid rgba(255,255,255,0.12)"}
    />
  </div>
);

// ── Main Page ────────────────────────────────────────────
export default function ScanPage() {
  const [nama, setNama]             = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [scanning, setScanning]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [status, setStatus]         = useState(null);
  const [hasilScan, setHasilScan]   = useState(null);

  const videoRef   = useRef(null);
  const readerRef  = useRef(null);
  const posisiRef  = useRef(null);

  // Ambil GPS saat mount
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

    // Refresh GPS setiap scan
    try {
      const pos = await dapatkanPosisi();
      posisiRef.current = pos;
    } catch (err) {
      setStatus({tipe:"warning", pesan:`GPS tidak tersedia: ${err.message}\nScan tetap bisa dilakukan tapi jarak tidak terverifikasi.`});
    }

    setScanning(true);
    setStatus(null);
    setHasilScan(null);

    // Tunggu video element siap
    await new Promise(r => setTimeout(r, 300));

    try {
      const { BrowserMultiFormatReader } = await import("@zxing/library");
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      await reader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          prosesHasilScan(result.getText());
        }
        // NotFoundException adalah noise normal, abaikan
      });
    } catch (err) {
      setStatus({tipe:"error", pesan:`Gagal membuka kamera: ${err.message}`});
      setScanning(false);
    }
  };

  const prosesHasilScan = async (rawText) => {
    stopCamera();
    setLoading(true);
    setStatus({tipe:"info", pesan:"🔍 Memverifikasi QR Code..."});

    const dataTitik = decodeBarcodeFlexibel(rawText);
    if (!dataTitik) {
      setStatus({tipe:"error", pesan:"QR Code tidak valid!\nPastikan Anda scan QR Code resmi dari menu Generator QR."});
      setLoading(false);
      return;
    }

    const posisi = posisiRef.current;
    if (!posisi) {
      setStatus({tipe:"error", pesan:"Data GPS tidak tersedia. Tutup dan coba lagi."});
      setLoading(false);
      return;
    }

    const jarak = hitungJarak(posisi.latitude, posisi.longitude, dataTitik.latitude, dataTitik.longitude);
    const jarakBulat = Math.round(jarak * 10) / 10;

    if (jarak > JARAK_MAKS) {
      setStatus({tipe:"warning", pesan:`JARAK TERLALU JAUH!\n\nAnda berada ${jarakBulat} meter dari titik "${dataTitik.nama}".\nMaksimal: ${JARAK_MAKS} meter.\n\nPindah lebih dekat lalu scan ulang.`});
      setLoading(false);
      return;
    }

    try {
      const now     = new Date();
      const localId = buatId(now);
      const sesi    = getSesiSaatIni();
      const tanggal = formatTanggalPendek(now);
      const jam     = formatWaktu(now);

      setStatus({tipe:"info", pesan:"📤 Mengirim data ke server..."});

      const payload = {
        namaPetugas: nama.trim(),
        keterangan:  keterangan.trim() || "Tidak ada kejadian",
        namaTitik:   dataTitik.nama,
        latTitik:    dataTitik.latitude,
        lngTitik:    dataTitik.longitude,
        latPetugas:  posisi.latitude,
        lngPetugas:  posisi.longitude,
        jarak:       jarakBulat,
        timestamp:   now.toISOString(),
        status:      "VALID",
      };

      // Kirim via JSONP — satu-satunya cara yang bisa follow redirect GAS
      const gasResponse = await simpanDataJSONP(payload);
      console.log("✅ GAS response:", gasResponse);

      

      setHasilScan({ namaTitik: dataTitik.nama, jarak: jarakBulat, jam, tanggal, sesi, id: gasResponse.id || localId });
      setStatus({tipe:"sukses", pesan:`Scan berhasil! Titik "${dataTitik.nama}" tercatat pada ${jam} WITA.`});
      setKeterangan("");

    } catch (err) {
      console.error("❌ Gagal kirim data:", err);
      setStatus({tipe:"error", pesan:`Gagal mengirim data ke server.\nError: ${err.message}\n\nPastikan URL Apps Script sudah benar dan GAS sudah di-deploy ulang dengan kode JSONP terbaru.`});
    }

    setLoading(false);
  };

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22,fontWeight:700,margin:0,color:"#f1f5f9"}}>Kontrol Keliling</h1>
        <p style={{margin:"4px 0 0",fontSize:13,color:"#64748b"}}>{getSesiSaatIni()} · {formatTanggalPendek()}</p>
      </div>

      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:20,marginBottom:16}}>
        <Input label="Nama Petugas" value={nama} onChange={setNama} placeholder="Masukkan nama lengkap" required />
        <div>
          <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
            Keterangan / Kejadian
          </label>
          <textarea value={keterangan} onChange={e=>setKeterangan(e.target.value)}
            placeholder="Tulis kejadian atau kondisi (opsional)" rows={3}
            style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit",lineHeight:1.5}}
            onFocus={e=>e.target.style.border="1px solid rgba(96,165,250,0.6)"}
            onBlur={e=>e.target.style.border="1px solid rgba(255,255,255,0.12)"}
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

      {status && <StatusChip tipe={status.tipe} pesan={status.pesan} />}

      {hasilScan && (
        <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:16,padding:20,marginTop:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"#4ade80",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>✅ Berhasil Tercatat di Spreadsheet</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["Titik",hasilScan.namaTitik],["Jarak",`${hasilScan.jarak} m`],["Waktu",hasilScan.jam],["Sesi",hasilScan.sesi]].map(([k,v])=>(
              <div key={k} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{k}</div>
                <div style={{fontSize:14,fontWeight:600,color:"#e2e8f0"}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:10,color:"#475569",marginTop:12,textAlign:"center",fontFamily:"monospace"}}>{hasilScan.id}</div>
        </div>
      )}

      {!scanning && (
        <button onClick={mulaiScan} disabled={loading}
          style={{width:"100%",marginTop:20,padding:"16px",background:loading?"rgba(59,130,246,0.3)":"linear-gradient(135deg,#2563eb,#7c3aed)",border:"none",borderRadius:14,color:"white",fontSize:16,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:loading?"none":"0 4px 24px rgba(37,99,235,0.4)",fontFamily:"inherit"}}>
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

      <div style={{marginTop:16,padding:"12px 16px",background:"rgba(255,255,255,0.02)",borderRadius:10,display:"flex",alignItems:"center",gap:10}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span style={{fontSize:12,color:"#64748b",lineHeight:1.5}}>
          Maksimal jarak scan: <strong style={{color:"#94a3b8"}}>{JARAK_MAKS} meter</strong> dari titik QR Code.
        </span>
      </div>
    </div>
  );
}