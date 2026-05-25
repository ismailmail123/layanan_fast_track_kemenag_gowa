// ============================================================
// pages/ScanPage.jsx - Halaman Scan Kontrol Keliling
// ============================================================
import { useState, useRef, useEffect } from "react";
// import { BrowserMultiFormatReader } from "@zxing/library";
import { decodeBarcode, hitungJarak, dapatkanPosisi, getSesiSaatIni, formatWaktu, formatTanggalPendek } from "../utils/index";
import { APPS_SCRIPT_URL } from "../App";

const JARAK_MAKS = 5; // meter

// ── Komponen Chip Status ─────────────────────────────────
const StatusChip = ({ tipe, pesan }) => {
  const warna = {
    error: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#f87171" },
    sukses: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#4ade80" },
    info: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)", text: "#60a5fa" },
    warning: { bg: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.4)", text: "#facc15" }
  }[tipe] || {};

  return (
    <div style={{
      background: warna.bg,
      border: `1px solid ${warna.border}`,
      borderRadius: 10,
      padding: "12px 16px",
      color: warna.text,
      fontSize: 13,
      fontWeight: 500,
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginTop: 12
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>
        {tipe === "error" ? "⚠️" : tipe === "sukses" ? "✅" : tipe === "warning" ? "🔴" : "ℹ️"}
      </span>
      <span style={{ lineHeight: 1.5 }}>{pesan}</span>
    </div>
  );
};

// ── Komponen Input ───────────────────────────────────────
const Input = ({ label, value, onChange, placeholder, type = "text", required }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
      {label} {required && <span style={{ color: "#f87171" }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10,
        padding: "12px 14px",
        color: "#f1f5f9",
        fontSize: 14,
        outline: "none",
        boxSizing: "border-box",
        transition: "border 0.2s"
      }}
      onFocus={e => e.target.style.border = "1px solid rgba(96,165,250,0.6)"}
      onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.12)"}
    />
  </div>
);

// ── Main Page ────────────────────────────────────────────
export default function ScanPage() {
  const [nama, setNama] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { tipe, pesan }
  const [hasilScan, setHasilScan] = useState(null);
  const [posisiPetugas, setPosisiPetugas] = useState(null);

  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  // Cleanup kamera saat unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const mulaiScan = async () => {
    if (!nama.trim()) {
      setStatus({ tipe: "error", pesan: "Nama petugas wajib diisi sebelum scan!" });
      return;
    }

    setStatus({ tipe: "info", pesan: "Mengambil posisi GPS Anda..." });
    setHasilScan(null);

    try {
      const posisi = await dapatkanPosisi();
      setPosisiPetugas(posisi);
      setStatus({ tipe: "info", pesan: "GPS berhasil. Arahkan kamera ke QR Code titik patroli." });
      setScanning(true);

      // Tunggu video element tersedia
      setTimeout(() => initScanner(posisi), 300);
    } catch (err) {
      setStatus({ tipe: "error", pesan: err.message });
    }
  };

  const initScanner = async (posisi) => {
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/library");
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      reader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          prosesHasilScan(result.getText(), posisi);
        }
      });
    } catch (err) {
      setStatus({ tipe: "error", pesan: "Kamera tidak dapat diakses: " + err.message });
      stopCamera();
    }
  };

  const prosesHasilScan = async (rawText, posisi) => {
  stopCamera();
  setLoading(true);
  
  console.log("========== DEBUG QR SCAN ==========");
  console.log("Raw QR Text (length):", rawText.length);
  console.log("Raw QR Text (full):", rawText);
  
  setStatus({ tipe: "info", pesan: "Memverifikasi data QR Code..." });
  
  let dataTitik = null;
  let decodingMethod = "";
  
  // Method 1: Langsung sebagai JSON
  try {
    const parsed = JSON.parse(rawText);
    if (parsed.nama && parsed.latitude && parsed.longitude) {
      dataTitik = {
        nama: parsed.nama,
        latitude: parseFloat(parsed.latitude),
        longitude: parseFloat(parsed.longitude)
      };
      decodingMethod = "JSON Langsung";
      console.log("✅ Method 1 berhasil:", decodingMethod, dataTitik);
    }
  } catch (e) {
    console.log("Method 1 gagal:", e.message);
  }
  
  // Method 2: Base64 decode
  if (!dataTitik) {
    try {
      const decoded = atob(rawText);
      console.log("Base64 decoded:", decoded);
      const parsed = JSON.parse(decoded);
      if (parsed.nama && parsed.latitude !== undefined && parsed.longitude !== undefined) {
        dataTitik = {
          nama: parsed.nama,
          latitude: parseFloat(parsed.latitude),
          longitude: parseFloat(parsed.longitude)
        };
        decodingMethod = "Base64 JSON";
        console.log("✅ Method 2 berhasil:", decodingMethod, dataTitik);
      }
    } catch (e) {
      console.log("Method 2 gagal:", e.message);
    }
  }
  
  console.log("========== DECODING RESULT ==========");
  console.log("Success:", !!dataTitik);
  console.log("Method:", decodingMethod);
  console.log("Data:", dataTitik);
  
  if (!dataTitik) {
    setStatus({ 
      tipe: "error", 
      pesan: `QR Code tidak valid!\n\nData yang discan:\n${rawText.substring(0, 200)}` 
    });
    setLoading(false);
    return;
  }
  
  // ✅ KODE SAMPAI SINI BERHASIL
  
  console.log("========== POSISI PETUGAS ==========");
  console.log("Posisi Petugas:", posisi);
  
  if (!posisi) {
    console.error("❌ Posisi petugas tidak ada!");
    setStatus({ tipe: "error", pesan: "Lokasi GPS tidak tersedia. Coba lagi." });
    setLoading(false);
    return;
  }
  
  // Hitung jarak
  console.log("========== MENGHITUNG JARAK ==========");
  console.log("Titik patroli:", dataTitik.latitude, dataTitik.longitude);
  console.log("Posisi petugas:", posisi.latitude, posisi.longitude);
  
  const jarak = hitungJarak(
    posisi.latitude, posisi.longitude,
    dataTitik.latitude, dataTitik.longitude
  );
  
  const jarakBulatkan = Math.round(jarak * 10) / 10;
  console.log("Jarak:", jarakBulatkan, "meter");
  
  const JARAK_MAKS = 5;
  
  if (jarak > JARAK_MAKS) {
    console.log("❌ Jarak terlalu jauh!");
    setStatus({
      tipe: "warning",
      pesan: `⚠️ JARAK TERLALU JAUH!\n\nAnda berada ${jarakBulatkan} meter dari titik "${dataTitik.nama}".\n\nMaksimal jarak yang diizinkan adalah ${JARAK_MAKS} meter.\n\nMohon pindah ke posisi yang lebih dekat dengan titik patroli dan scan ulang.`
    });
    setLoading(false);
    return;
  }
  
  console.log("✅ Jarak valid, mengirim data ke server...");
  
  // Kirim ke Google Sheets
  try {
    const now = new Date();
    const payload = {
      action: "savePatrol",
      namaPetugas: nama.trim(),
      keterangan: keterangan.trim() || "Tidak ada kejadian",
      namaTitik: dataTitik.nama,
      latTitik: dataTitik.latitude,
      lngTitik: dataTitik.longitude,
      latPetugas: posisi.latitude,
      lngPetugas: posisi.longitude,
      jarak: jarakBulatkan,
      timestamp: now.toISOString(),
      status: "VALID"
    };
    
    console.log("Payload yang dikirim:", payload);
    
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);
    
    if (data.success) {
      console.log("✅ Data berhasil disimpan!");
      setHasilScan({
        namaTitik: dataTitik.nama,
        jarak: jarakBulatkan,
        jam: formatWaktu(now),
        tanggal: formatTanggalPendek(now),
        sesi: getSesiSaatIni(),
        id: data.id
      });
      setStatus({ tipe: "sukses", pesan: `✅ Scan berhasil! Titik "${dataTitik.nama}" tercatat pada ${formatWaktu(now)} WITA` });
      setKeterangan("");
    } else {
      console.error("❌ Server error:", data);
      setStatus({ tipe: "error", pesan: `Gagal menyimpan data: ${data.message || "Coba lagi."}` });
    }
  } catch (err) {
    console.error("❌ Network error:", err);
    setStatus({ tipe: "error", pesan: "Koneksi gagal. Periksa internet Anda." });
  }
  
  setLoading(false);
};

  return (
    <div>
      {/* ── Header ─── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>
          Kontrol Keliling
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
          {getSesiSaatIni()} · {formatTanggalPendek()}
        </p>
      </div>

      {/* ── Form Input ─── */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16
      }}>
        <Input
          label="Nama Petugas"
          value={nama}
          onChange={setNama}
          placeholder="Masukkan nama lengkap"
          required
        />
        <div style={{ marginBottom: 0 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Keterangan / Kejadian
          </label>
          <textarea
            value={keterangan}
            onChange={e => setKeterangan(e.target.value)}
            placeholder="Tulis kejadian atau kondisi (opsional)"
            rows={3}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10,
              padding: "12px 14px",
              color: "#f1f5f9",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: 1.5
            }}
            onFocus={e => e.target.style.border = "1px solid rgba(96,165,250,0.6)"}
            onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.12)"}
          />
        </div>
      </div>

      {/* ── Kamera Scanner ─── */}
      {scanning && (
        <div style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 16,
          background: "#000",
          aspectRatio: "4/3"
        }}>
          <video
            ref={videoRef}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            playsInline muted autoPlay
          />
          {/* Overlay scanner */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ position: "relative", width: 200, height: 200 }}>
              {/* Corner borders */}
              {[
                { top: 0, left: 0, borderTop: "3px solid #3b82f6", borderLeft: "3px solid #3b82f6" },
                { top: 0, right: 0, borderTop: "3px solid #3b82f6", borderRight: "3px solid #3b82f6" },
                { bottom: 0, left: 0, borderBottom: "3px solid #3b82f6", borderLeft: "3px solid #3b82f6" },
                { bottom: 0, right: 0, borderBottom: "3px solid #3b82f6", borderRight: "3px solid #3b82f6" }
              ].map((s, i) => (
                <div key={i} style={{ position: "absolute", width: 30, height: 30, ...s }}/>
              ))}
              {/* Scan line animation */}
              <div style={{
                position: "absolute", left: 0, right: 0,
                height: 2, background: "rgba(59,130,246,0.8)",
                animation: "scanline 2s linear infinite",
                top: 0
              }}/>
            </div>
          </div>

          {/* Tombol tutup */}
          <button
            onClick={stopCamera}
            style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8, color: "white",
              padding: "6px 14px", fontSize: 12,
              cursor: "pointer"
            }}
          >
            ✕ Batal
          </button>
        </div>
      )}

      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 196px; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>

      {/* ── Status / Feedback ─── */}
      {status && (
        <StatusChip tipe={status.tipe} pesan={status.pesan} />
      )}

      {/* ── Hasil Scan Card ─── */}
      {hasilScan && (
        <div style={{
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 16,
          padding: 20,
          marginTop: 16
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#4ade80", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
            ✅ Catatan Berhasil
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Titik", hasilScan.namaTitik],
              ["Jarak", `${hasilScan.jarak} m`],
              ["Waktu", hasilScan.jam],
              ["Sesi", hasilScan.sesi]
            ].map(([k, v]) => (
              <div key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "#475569", marginTop: 12, textAlign: "center" }}>
            ID: {hasilScan.id}
          </div>
        </div>
      )}

      {/* ── Tombol Scan ─── */}
      {!scanning && (
        <button
          onClick={mulaiScan}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "16px",
            background: loading
              ? "rgba(59,130,246,0.3)"
              : "linear-gradient(135deg, #2563eb, #7c3aed)",
            border: "none",
            borderRadius: 14,
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            letterSpacing: 0.5,
            transition: "opacity 0.2s",
            boxShadow: loading ? "none" : "0 4px 24px rgba(37,99,235,0.4)"
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 18, height: 18,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid white",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                display: "inline-block"
              }}/>
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Info Jarak ─── */}
      <div style={{
        marginTop: 16,
        padding: "12px 16px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        gap: 10
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
          Maksimal jarak scan dari titik: <strong style={{ color: "#94a3b8" }}>{JARAK_MAKS} meter</strong>. Pastikan Anda berada di dekat QR Code.
        </span>
      </div>
    </div>
  );
}