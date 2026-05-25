// ============================================================
// pages/SemuaDataPage.jsx - Riwayat Semua Data Kontrol
// ============================================================
import { useState, useEffect } from "react";
import { SESI_CONFIG } from "../utils/index";
import { APPS_SCRIPT_URL } from "../App";

const WARNA_SESI = Object.fromEntries(SESI_CONFIG.map(s => [s.id, s.warna]));
const ICON_SESI = Object.fromEntries(SESI_CONFIG.map(s => [s.id, s.icon]));

// ── Filter Chip ──────────────────────────────────────────
const FilterChip = ({ label, active, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 14px",
      borderRadius: 100,
      border: active ? `1px solid ${color || "#60a5fa"}` : "1px solid rgba(255,255,255,0.1)",
      background: active ? (color || "#60a5fa") + "22" : "transparent",
      color: active ? (color || "#60a5fa") : "#64748b",
      fontSize: 11,
      fontWeight: 600,
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "all 0.15s"
    }}
  >{label}</button>
);

// ── Row Data ─────────────────────────────────────────────
const DataRow = ({ data }) => {
  const [expand, setExpand] = useState(false);
  const warna = WARNA_SESI[data.sesi] || "#60a5fa";
  const icon = ICON_SESI[data.sesi] || "📍";

  return (
    <div
      onClick={() => setExpand(!expand)}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderLeft: `3px solid ${warna}`,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        cursor: "pointer",
        transition: "background 0.15s"
      }}
    >
      {/* Baris utama */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>
              {data.namaPetugas}
            </span>
            <span style={{
              fontSize: 10,
              background: warna + "22",
              color: warna,
              borderRadius: 6,
              padding: "2px 8px",
              fontWeight: 600
            }}>
              {icon} {data.sesi}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>
            {data.tanggal} · {data.jam} WITA
          </div>
        </div>
        <span style={{
          fontSize: 13,
          color: expand ? "#60a5fa" : "#475569",
          marginLeft: 8,
          transition: "transform 0.2s",
          transform: expand ? "rotate(180deg)" : "rotate(0deg)",
          display: "inline-block"
        }}>▾</span>
      </div>

      {/* Detail saat expand */}
      {expand && (
        <div style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            {[
              ["📍 Titik", data.namaTitik],
              ["📏 Jarak", `${data.jarak} m`],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{v}</div>
              </div>
            ))}
          </div>
          {data.keterangan && data.keterangan !== "Tidak ada kejadian" && (
            <div style={{
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
          <div style={{ marginTop: 10, fontSize: 10, color: "#374151", fontFamily: "monospace" }}>
            {data.id}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────
export default function SemuaDataPage() {
  const [semua, setSemua] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterSesi, setFilterSesi] = useState("SEMUA");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [cari, setCari] = useState("");
  const [hal, setHal] = useState(1);

  const PER_HAL = 20;

  const ambilData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${APPS_SCRIPT_URL}?action=getAllPatrols`;
      const res = await fetch(url);
      const json = await res.json();
      setSemua(json.data || []);
    } catch {
      setError("Gagal memuat data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    // Defer calling ambilData to avoid synchronous setState within effect
    const timer = setTimeout(() => {
      if (!isMounted) return;
      ambilData();
    }, 0);
    return () => { isMounted = false; clearTimeout(timer); };
  }, []);

  // Filter
  const filtered = semua.filter(d => {
    const matchSesi = filterSesi === "SEMUA" || d.sesi === filterSesi;
    const matchTanggal = !filterTanggal || d.tanggal === filterTanggal;
    const matchCari = !cari || [d.namaPetugas, d.namaTitik, d.keterangan].some(
      v => v?.toLowerCase().includes(cari.toLowerCase())
    );
    return matchSesi && matchTanggal && matchCari;
  });

  const totalHal = Math.ceil(filtered.length / PER_HAL);
  const dataHal = filtered.slice((hal - 1) * PER_HAL, hal * PER_HAL);

  const resetHal = () => setHal(1);

  // Statistik ringkas
  const statPerSesi = SESI_CONFIG.map(s => ({
    ...s,
    count: semua.filter(d => d.sesi === s.id).length
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#f1f5f9" }}>
          Riwayat Semua Data
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
          Total {semua.length} catatan kontrol
        </p>
      </div>

      {/* Stat bar */}
      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        marginBottom: 20,
        paddingBottom: 4,
        scrollbarWidth: "none"
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
            <div style={{ fontSize: 9, color: "#64748b" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={cari}
          onChange={e => { setCari(e.target.value); resetHal(); }}
          placeholder="🔍  Cari nama petugas, titik, keterangan..."
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "12px 14px",
            color: "#f1f5f9",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Filter Sesi */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 10, scrollbarWidth: "none" }}>
        <FilterChip
          label="Semua Sesi"
          active={filterSesi === "SEMUA"}
          onClick={() => { setFilterSesi("SEMUA"); resetHal(); }}
          color="#60a5fa"
        />
        {SESI_CONFIG.map(s => (
          <FilterChip
            key={s.id}
            label={`${s.icon} ${s.label}`}
            active={filterSesi === s.id}
            onClick={() => { setFilterSesi(s.id); resetHal(); }}
            color={s.warna}
          />
        ))}
      </div>

      {/* Filter Tanggal */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={filterTanggal}
          onChange={e => { setFilterTanggal(e.target.value); resetHal(); }}
          placeholder="Filter tanggal (dd/mm/yyyy)"
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#f1f5f9",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Hasil & Refresh */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>
          Menampilkan {filtered.length} data
        </span>
        <button
          onClick={ambilData}
          disabled={loading}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#94a3b8",
            padding: "6px 12px",
            fontSize: 11,
            cursor: "pointer"
          }}
        >{loading ? "⏳" : "🔄"} {loading ? "Memuat..." : "Refresh"}</button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 10, padding: 14,
          color: "#f87171", fontSize: 13, marginBottom: 16
        }}>⚠️ {error}</div>
      )}

      {/* Data List */}
      {loading && semua.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div>Memuat data...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.08)",
          borderRadius: 16, color: "#475569"
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 14, color: "#64748b" }}>Tidak ada data ditemukan</div>
        </div>
      ) : (
        <>
          {dataHal.map((d, i) => <DataRow key={i} data={d} />)}

          {/* Pagination */}
          {totalHal > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <button
                onClick={() => setHal(h => Math.max(1, h - 1))}
                disabled={hal === 1}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#94a3b8",
                  padding: "8px 16px", fontSize: 12,
                  cursor: hal === 1 ? "not-allowed" : "pointer",
                  opacity: hal === 1 ? 0.4 : 1
                }}
              >← Sebelumnya</button>
              <span style={{ padding: "8px 14px", fontSize: 12, color: "#64748b" }}>
                {hal} / {totalHal}
              </span>
              <button
                onClick={() => setHal(h => Math.min(totalHal, h + 1))}
                disabled={hal === totalHal}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#94a3b8",
                  padding: "8px 16px", fontSize: 12,
                  cursor: hal === totalHal ? "not-allowed" : "pointer",
                  opacity: hal === totalHal ? 0.4 : 1
                }}
              >Berikutnya →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}