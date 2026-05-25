// ============================================================
// pages/GeneratorPage.jsx - Generator QR Code Titik Patroli
// ============================================================
import { useState, useRef, useEffect } from "react";
import { encodeBarcode } from "../utils/index";

// Data titik patroli bawaan (bisa disesuaikan)
const TITIK_DEFAULT = [
  { nama: "Pos Utama", lat: -5.1477, lng: 119.4327 },
  { nama: "Blok A - Sel 1-10", lat: -5.1480, lng: 119.4330 },
  { nama: "Blok B - Sel 11-20", lat: -5.1483, lng: 119.4333 },
  { nama: "Blok C - Sel 21-30", lat: -5.1486, lng: 119.4336 },
  { nama: "Area Dapur", lat: -5.1490, lng: 119.4340 },
  { nama: "Aula / Musholla", lat: -5.1493, lng: 119.4343 },
  { nama: "Area Kunjungan", lat: -5.1496, lng: 119.4346 },
  { nama: "Pintu Gerbang", lat: -5.1499, lng: 119.4349 }
];

// ── QR Code renderer menggunakan canvas ──────────────────
function renderQR(canvas, text) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);

  // Kita render placeholder visual (QR library loaded via CDN)
  ctx.fillStyle = "#1a1a2e";
  ctx.font = "11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("QR: " + text.substring(0, 20) + "...", size / 2, size / 2);
}

// ── Form Input Titik ─────────────────────────────────────
const InputTitik = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 5 }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      step={type === "number" ? "0.000001" : undefined}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 8,
        padding: "10px 12px",
        color: "#f1f5f9",
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box"
      }}
    />
  </div>
);

// ── Card QR Code per titik ───────────────────────────────
const TitikCard = ({ titik, onHapus, index }) => {
  const canvasRef = useRef(null);
  const encoded = encodeBarcode(titik.nama, titik.lat, titik.lng);
  const [qrLoaded, setQrLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => {
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
        try {
          new window.QRCode(canvasRef.current, {
            text: encoded,
            width: 160,
            height: 160,
            colorDark: "#0f172a",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.H
          });
          Promise.resolve().then(() => setQrLoaded(true));
        } catch (error) {
          console.error("Gagal render QR:", error);
        }
      }
    };
    if (!window.QRCode) {
      document.head.appendChild(script);
    } else {
      if (canvasRef.current) {
        canvasRef.current.innerHTML = "";
        try {
          new window.QRCode(canvasRef.current, {
            text: encoded,
            width: 160,
            height: 160,
            colorDark: "#0f172a",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.H
          });
          Promise.resolve().then(() => setQrLoaded(true));
        } catch (error) {
          console.error("Gagal render QR:", error);
        }
      }
    }
  }, [encoded]);

  const downloadQR = () => {
    const container = canvasRef.current;
    if (!container) return;
    const img = container.querySelector("img") || container.querySelector("canvas");
    if (!img) return;

    const link = document.createElement("a");
    if (img.tagName === "IMG") {
      link.href = img.src;
    } else {
      link.href = img.toDataURL("image/png");
    }
    link.download = `QR-Patroli-${titik.nama.replace(/\s+/g, "-")}.png`;
    link.click();
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: 16,
      marginBottom: 12
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>
            📍 {titik.nama}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
            {titik.lat.toFixed(6)}, {titik.lng.toFixed(6)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={downloadQR}
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 8,
              color: "#60a5fa",
              padding: "5px 12px",
              fontSize: 11,
              cursor: "pointer",
              fontWeight: 600
            }}
          >⬇ Unduh</button>
          <button
            onClick={() => onHapus(index)}
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8,
              color: "#f87171",
              padding: "5px 10px",
              fontSize: 11,
              cursor: "pointer"
            }}
          >✕</button>
        </div>
      </div>

      {/* QR Code */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 16
      }}>
        <div style={{
          background: "white",
          borderRadius: 10,
          padding: 8,
          flexShrink: 0
        }}>
          <div ref={canvasRef} style={{ width: 160, height: 160 }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            Data Terenkripsi (Base64)
          </div>
          <div style={{
            background: "rgba(0,0,0,0.3)",
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
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────
export default function GeneratorPage() {
  const [daftarTitik, setDaftarTitik] = useState(TITIK_DEFAULT);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nama: "", lat: "", lng: "" });
  const [errorForm, setErrorForm] = useState("");

  const tambahTitik = () => {
    if (!form.nama.trim()) { setErrorForm("Nama titik wajib diisi"); return; }
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (isNaN(lat) || isNaN(lng)) { setErrorForm("Latitude dan longitude harus berupa angka"); return; }
    if (lat < -90 || lat > 90) { setErrorForm("Latitude harus antara -90 dan 90"); return; }
    if (lng < -180 || lng > 180) { setErrorForm("Longitude harus antara -180 dan 180"); return; }

    setDaftarTitik(prev => [...prev, { nama: form.nama.trim(), lat, lng }]);
    setForm({ nama: "", lat: "", lng: "" });
    setShowForm(false);
    setErrorForm("");
  };

  const hapusTitik = (idx) => {
    setDaftarTitik(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>
          Generator QR Patroli
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
          Buat QR Code terenkripsi untuk setiap titik
        </p>
      </div>

      {/* Info */}
      <div style={{
        background: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.2)",
        borderRadius: 12,
        padding: "12px 16px",
        marginBottom: 20,
        fontSize: 12,
        color: "#93c5fd",
        lineHeight: 1.7
      }}>
        <strong style={{ color: "#60a5fa" }}>📋 Cara Penggunaan:</strong><br/>
        1. Tambah titik patroli dengan nama dan koordinat GPS<br/>
        2. Unduh QR Code masing-masing titik<br/>
        3. Cetak dan pasang QR Code di titik yang ditentukan<br/>
        4. Data dalam QR Code terenkripsi Base64 — tidak bisa dimanipulasi
      </div>

      {/* Tombol Tambah */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          width: "100%",
          padding: "13px",
          background: showForm ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #1d4ed8, #6d28d9)",
          border: showForm ? "1px solid rgba(255,255,255,0.1)" : "none",
          borderRadius: 12,
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: showForm ? "none" : "0 4px 20px rgba(29,78,216,0.35)"
        }}
      >
        {showForm ? "✕ Batal" : "+ Tambah Titik Baru"}
      </button>

      {/* Form Tambah */}
      {showForm && (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: 18,
          marginBottom: 16
        }}>
          <InputTitik
            label="Nama Titik"
            value={form.nama}
            onChange={v => setForm(f => ({ ...f, nama: v }))}
            placeholder="cth: Blok D - Kamar 31-40"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <InputTitik
              label="Latitude"
              value={form.lat}
              onChange={v => setForm(f => ({ ...f, lat: v }))}
              placeholder="-5.1477"
              type="number"
            />
            <InputTitik
              label="Longitude"
              value={form.lng}
              onChange={v => setForm(f => ({ ...f, lng: v }))}
              placeholder="119.4327"
              type="number"
            />
          </div>

          {/* Tip GPS */}
          <div style={{
            fontSize: 11,
            color: "#64748b",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 14,
            lineHeight: 1.6
          }}>
            💡 <strong style={{ color: "#94a3b8" }}>Tip:</strong> Buka Google Maps di titik fisik yang diinginkan, tap tahan lokasi untuk melihat koordinat.
          </div>

          {errorForm && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "10px 14px",
              color: "#f87171", fontSize: 12, marginBottom: 12
            }}>⚠️ {errorForm}</div>
          )}

          <button
            onClick={tambahTitik}
            style={{
              width: "100%",
              padding: "12px",
              background: "#1d4ed8",
              border: "none",
              borderRadius: 10,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            ✅ Buat QR Code
          </button>
        </div>
      )}

      {/* Daftar Titik & QR */}
      <div style={{ marginBottom: 8, fontSize: 12, color: "#64748b" }}>
        {daftarTitik.length} titik patroli terdaftar
      </div>

      {daftarTitik.map((titik, i) => (
        <TitikCard key={i} titik={titik} onHapus={hapusTitik} index={i} />
      ))}
    </div>
  );
}