// ============================================================
// pages/HariIniPage.jsx - Laporan Kontrol Hari Ini Per Sesi
// ============================================================
import { useState, useEffect } from "react";
import { SESI_CONFIG, getSesiSaatIni, formatTanggal, formatTanggalPendek } from "../utils/index";
import { APPS_SCRIPT_URL } from "../App";

// ── Badge Sesi ───────────────────────────────────────────
const SesiBadge = ({ sesi, active, onClick, count }) => (
  <button
    onClick={onClick}
    style={{
      flex: "0 0 auto",
      padding: "8px 16px",
      borderRadius: 100,
      border: active
        ? `1px solid ${sesi.warna}`
        : "1px solid rgba(255,255,255,0.1)",
      background: active ? sesi.warna + "22" : "transparent",
      color: active ? sesi.warna : "#64748b",
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

// ── Kartu Data Patroli ───────────────────────────────────
const PatrolCard = ({ data, warnaSesi }) => (
  <div style={{
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderLeft: `3px solid ${warnaSesi}`,
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 10
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{data.namaPetugas}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{data.jam} WITA</div>
      </div>
      <div style={{
        background: "rgba(34,197,94,0.15)",
        border: "1px solid rgba(34,197,94,0.3)",
        borderRadius: 6,
        padding: "3px 10px",
        fontSize: 10,
        fontWeight: 700,
        color: "#4ade80",
        letterSpacing: 0.5
      }}>VALID</div>
    </div>

    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }}>
      <InfoItem icon="📍" label="Titik" val={data.namaTitik} />
      <InfoItem icon="📏" label="Jarak" val={`${data.jarak} m`} />
    </div>

    {data.keterangan && data.keterangan !== "Tidak ada kejadian" && (
      <div style={{
        marginTop: 10,
        padding: "10px 12px",
        background: "rgba(251,191,36,0.08)",
        border: "1px solid rgba(251,191,36,0.2)",
        borderRadius: 8,
        fontSize: 12,
        color: "#fbbf24",
        lineHeight: 1.5
      }}>
        <strong>Kejadian:</strong> {data.keterangan}
      </div>
    )}
  </div>
);

const InfoItem = ({ icon, label, val }) => (
  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px" }}>
    <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>{icon} {label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{val}</div>
  </div>
);

// ── Main Page ────────────────────────────────────────────
export default function HariIniPage() {
  const [sesiAktif, setSesiAktif] = useState(getSesiSaatIni());
  const [dataMap, setDataMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const ambilData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tanggal = formatTanggalPendek();
      const hasil = {};

      // Ambil data semua sesi sekaligus
      await Promise.all(SESI_CONFIG.map(async (s) => {
        const url = `${APPS_SCRIPT_URL}?action=getPatrols&tanggal=${encodeURIComponent(tanggal)}&sesi=${encodeURIComponent(s.id)}`;
        const res = await fetch(url);
        const json = await res.json();
        hasil[s.id] = json.data || [];
      }));

      setDataMap(hasil);
      setLastRefresh(new Date());
    } catch {
      setError("Gagal memuat data. Periksa koneksi internet.");
    }
    setLoading(false);
  };

  useEffect(() => {
    // avoid synchronous setState during effect by scheduling the initial load
    const initTimeout = setTimeout(() => ambilData(), 0);
    const interval = setInterval(ambilData, 60000); // refresh tiap 1 menit
    return () => {
      clearTimeout(initTimeout);
      clearInterval(interval);
    };
  }, []);

  const sesiConfig = SESI_CONFIG.find(s => s.id === sesiAktif);
  const dataSesi = dataMap[sesiAktif] || [];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>
          Laporan Hari Ini
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
          {formatTanggal()}
        </p>
      </div>

      {/* Ringkasan Total */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10,
        marginBottom: 20
      }}>
        {SESI_CONFIG.map(s => (
          <div key={s.id} style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${s.warna}33`,
            borderRadius: 12,
            padding: "12px 14px",
            cursor: "pointer"
          }} onClick={() => setSesiAktif(s.id)}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
              {s.icon} {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.warna }}>
              {(dataMap[s.id] || []).length}
            </div>
            <div style={{ fontSize: 10, color: "#475569" }}>scan tercatat</div>
          </div>
        ))}
      </div>

      {/* Tab Sesi */}
      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 4,
        marginBottom: 16,
        scrollbarWidth: "none"
      }}>
        {SESI_CONFIG.map(s => (
          <SesiBadge
            key={s.id}
            sesi={s}
            active={sesiAktif === s.id}
            count={(dataMap[s.id] || []).length}
            onClick={() => setSesiAktif(s.id)}
          />
        ))}
      </div>

      {/* Info Sesi */}
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
            <div style={{ fontSize: 11, color: "#64748b" }}>{sesiConfig.jam} WITA</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: sesiConfig.warna }}>
              {dataSesi.length}
            </div>
            <div style={{ fontSize: 10, color: "#64748b" }}>total scan</div>
          </div>
        </div>
      )}

      {/* Tombol Refresh */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button
          onClick={ambilData}
          disabled={loading}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#94a3b8",
            padding: "6px 14px",
            fontSize: 12,
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6
          }}
        >
          {loading ? "⏳" : "🔄"} {loading ? "Memuat..." : "Perbarui"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 10,
          padding: 14,
          color: "#f87171",
          fontSize: 13,
          marginBottom: 16
        }}>⚠️ {error}</div>
      )}

      {/* Data */}
      {loading && dataSesi.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div>Memuat data...</div>
        </div>
      ) : dataSesi.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.08)",
          borderRadius: 16,
          color: "#475569"
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, color: "#64748b" }}>Belum ada data kontrol</div>
          <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
            untuk {sesiConfig?.label} hari ini
          </div>
        </div>
      ) : (
        dataSesi.map((d, i) => (
          <PatrolCard key={i} data={d} warnaSesi={sesiConfig?.warna || "#60a5fa"} />
        ))
      )}

      {/* Last refresh */}
      {lastRefresh && (
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#374151" }}>
          Terakhir diperbarui: {lastRefresh.toLocaleTimeString("id-ID")}
        </div>
      )}
    </div>
  );
}