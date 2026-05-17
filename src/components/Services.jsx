import { useState } from 'react';
import { X, Clock, ChevronRight, ChevronDown, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { JENIS_LAYANAN, COLOR_MAP } from '../services/ContactService';

/* ─── Modal detail layanan ─── */
function ServiceModal() {
  const { activeModal, closeModal } = useStore();
  const service = JENIS_LAYANAN.find((s) => s.id === activeModal);
  if (!service) return null;
  const c = COLOR_MAP[service.color];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-fadeInUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${c.bg} rounded-t-3xl px-7 pt-7 pb-5`}>
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-2 block`}>
                {service.tag}
              </span>
              <h3 className="font-['Playfair_Display'] text-2xl font-black text-gray-900">
                {service.label}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{service.desc}</p>
            </div>
            <div className="text-4xl ml-4">{service.icon}</div>
          </div>
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition cursor-pointer"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="px-7 py-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Daftar Layanan
          </p>
          <ul className="space-y-3">
            {service.items.map((item, i) => (
              <li
                key={i}
                className={`flex items-center justify-between p-3.5 rounded-xl border ${c.border} ${c.bg}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg ${c.accent} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {i + 1}
                  </span>
                  <span className="text-gray-800 text-sm font-medium">{item.name}</span>
                </div>
                {/* <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                  <Clock size={12} className={c.text} />
                  <span className={`text-xs font-bold ${c.text} whitespace-nowrap`}>{item.time}</span>
                </div> */}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-7 pb-7">
          <button onClick={closeModal} className="w-full green-btn text-white font-bold py-3.5 rounded-2xl cursor-pointer">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Accordion row per kategori ─── */
function ServiceAccordion({ service, isOpen, onToggle }) {
  const c = COLOR_MAP[service.color];
  return (
    <div className={`rounded-2xl border ${isOpen ? c.border : 'border-gray-100'} overflow-hidden transition-all duration-300 bg-white shadow-sm`}>
      {/* Header accordion */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${c.icon} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>
            {service.icon}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${c.badge}`}>
                {service.tag}
              </span>
              <span className="text-xs text-gray-400 font-medium">{service.items.length} layanan</span>
            </div>
            <h3 className="text-gray-900 font-bold text-base">{service.label}</h3>
            <p className="text-gray-400 text-xs mt-0.5 leading-relaxed hidden sm:block">{service.desc}</p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full ${c.icon} flex items-center justify-center flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={16} className={c.text} />
        </div>
      </button>

      {/* Expanded list */}
      {isOpen && (
        <div className="px-5 pb-5 animate-fadeInUp">
          <div className={`h-px ${c.bg} mb-4`} style={{ background: 'var(--tw-border-opacity)' }}></div>
          <div className="grid sm:grid-cols-2 gap-3">
            {service.items.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3.5 rounded-xl border ${c.border} ${c.bg} group hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-7 h-7 rounded-lg ${c.accent} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {i + 1}
                  </div>
                  <span className="text-gray-800 text-sm font-medium leading-snug">{item.name}</span>
                </div>
                {/* <div className={`flex items-center gap-1 flex-shrink-0 ml-3 px-2.5 py-1 rounded-full bg-white border ${c.border}`}>
                  <Clock size={11} className={c.text} />
                  <span className={`text-xs font-bold ${c.text} whitespace-nowrap`}>{item.time}</span>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Services Section ─── */
export default function Services() {
  // const { openModal } = useStore();
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (id) => setOpenAccordion(openAccordion === id ? null : id);

  return (
    <>
      

      {/* ══════════════ SECTION 2: Daftar Lengkap Layanan ══════════════ */}
      <section id="layanan" className="py-10 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex-1 mb-12">
            <div>
              <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-3">
                Daftar Layanan
              </p>
              <h2 className="font-['Playfair_Display'] text-4xl font-black text-gray-900 leading-tight">
                Semua Jenis <span className="text-emerald-600">Layanan Kami</span>
              </h2>
              <p className="text-gray-500 text-center">
                Daftar lengkap seluruh layanan beserta estimasi waktu proses masing-masing.
              </p>
            </div>
            
          </div>

          {/* Summary pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {JENIS_LAYANAN.map((s) => {
              const c = COLOR_MAP[s.color];
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setOpenAccordion(s.id);
                    setTimeout(() => document.getElementById(`acc-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${c.border} ${c.bg} ${c.text} text-sm font-semibold cursor-pointer hover:shadow-sm transition-shadow`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                  <span className={`w-5 h-5 rounded-full ${c.accent} text-white text-xs flex items-center justify-center font-bold`}>
                    {s.items.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Accordion list */}
          <div className="space-y-4">
            {JENIS_LAYANAN.map((service) => (
              <div id={`acc-${service.id}`} key={service.id}>
                <ServiceAccordion
                  service={service}
                  isOpen={openAccordion === service.id}
                  onToggle={() => toggleAccordion(service.id)}
                />
              </div>
            ))}
          </div>

          {/* Info footer */}
          <div className="mt-10 bg-[#022c1e] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/15 flex items-center justify-center text-2xl flex-shrink-0">
              ℹ️
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm mb-1">Catatan Estimasi Waktu</p>
              <p className="text-white/55 text-sm leading-relaxed">
                Estimasi waktu dihitung sejak berkas dinyatakan lengkap dan valid oleh petugas verifikasi.
                Waktu dapat berbeda tergantung antrean dan kelengkapan dokumen.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold">Fast Track</span>
            </div>
          </div>
        </div>
      </section>

      <ServiceModal />
    </>
  );
}
