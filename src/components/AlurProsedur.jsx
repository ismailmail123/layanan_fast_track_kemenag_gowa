import { CheckCircle, Wifi, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FAST_TRACK_STEPS, PROSEDUR, ONLINE_STEPS, OFFLINE_STEPS } from '../services/ContactService';

export default function AlurProsedur() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <section id="alur" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-3">
            Cara Kerja
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Alur & <span className="text-emerald-600">Prosedur</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Proses yang sederhana dan transparan dari pendaftaran hingga pengambilan dokumen.
          </p>
        </div>

        {/* Fast Track Flow */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <h3 className="font-bold text-gray-800 text-lg">Alur Layanan Fast Track</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {FAST_TRACK_STEPS.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center relative">
                {/* Connector line */}
                {i < FAST_TRACK_STEPS.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+24px)] hidden lg:block w-[calc(100%-48px)] h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-200" />
                )}
                <div className="w-12 h-12 rounded-2xl gold-btn flex items-center justify-center text-[#022c1e] font-black text-lg shadow-md mb-3 relative z-10">
                  {step.num}
                </div>
                <div className="text-2xl mb-2">{step.icon}</div>
                <p className="text-gray-900 font-bold text-xs leading-snug mb-1">{step.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two columns: Cara Kerja + Prosedur */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cara Kerja (2/3) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-bold text-gray-800 text-lg mb-6">Cara Kerja</h3>

            {/* Tab switcher */}
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit mb-8">
              {[
                { id: 'online', label: 'Online', icon: <Wifi size={14} /> },
                { id: 'offline', label: 'Offline', icon: <MapPin size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Steps */}
            <div className="flex flex-wrap gap-4 items-center">
              {(activeTab === 'online' ? ONLINE_STEPS : OFFLINE_STEPS).map((step, i, arr) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shadow-sm">
                      {step.icon}
                    </div>
                    <p className="text-xs font-semibold text-gray-700 text-center max-w-[80px] leading-tight">
                      {step.label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-emerald-400 font-bold text-xl flex-shrink-0">→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              {activeTab === 'online' ? (
                <p className="text-emerald-800 text-sm leading-relaxed">
                  <span className="font-bold">Layanan Online:</span> Upload berkas secara digital,
                  tunggu verifikasi, terima notifikasi, lalu ambil dokumen Anda di loket prioritas.
                </p>
              ) : (
                <p className="text-emerald-800 text-sm leading-relaxed">
                  <span className="font-bold">Layanan Offline:</span> Datang langsung ke loket
                  prioritas, proses verifikasi cepat, dokumen diproses instan, dan langsung selesai.
                </p>
              )}
            </div>
          </div>

          {/* Prosedur (1/3) */}
          <div className="bg-[#022c1e] rounded-3xl p-8 text-white">
            <h3 className="font-bold text-lg mb-2">Prosedur Layanan</h3>
            <p className="text-white/50 text-sm mb-7 leading-relaxed">
              Ikuti langkah-langkah berikut untuk mendapatkan layanan fast track.
            </p>
            <ul className="space-y-4">
              {PROSEDUR.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-emerald-400 flex-shrink-0 mt-0.5"
                  />
                  <span className="text-white/80 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
                Catatan Penting
              </p>
              <p className="text-white/50 text-xs leading-relaxed">
                Pastikan semua dokumen persyaratan sudah lengkap sebelum datang ke loket agar proses
                berjalan lebih cepat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}