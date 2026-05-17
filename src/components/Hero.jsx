
import { Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FAST_TRACK_STEPS } from '../services/ContactService';
import kemenagGowa from '../assets/fast-track.jpeg';

export default function Hero() {
  const setActiveSection = useStore((s) => s.setActiveSection);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  return (
    <section id="beranda" className="hero-bg min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Background Pattern Overlay - Enhanced */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-emerald-950/40 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Existing content tetap sama */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-2 mb-6 animate-fadeInUp">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-dot"></span>
              <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">
                Layanan Fast Track Kemenag Gowa
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6 animate-fadeInUp delay-100"
            >
            Ambil{' '}
              <span className="shimmer-text">Dokument</span>
              {', '}
              <br className="hidden sm:block" />
              Lebih Cepat{' '}
              <span className="text-emerald-400">dan Mudah</span>
            </h1>

            <p className="text-white/65 text-lg text-center mb-10">
              Selmat Datang, Layanan Cepat Anda Dimulai di Sini.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12 mt-10 animate-fadeInUp delay-300">
              <button
                onClick={() => scrollTo('daftar')}
                className="gold-btn px-7 py-4 rounded-2xl text-[#022c1e] font-bold text-base shadow-xl cursor-pointer flex items-center gap-2"
              >
                Daftar Sekarang <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollTo('layanan')}
                className="px-7 py-4 rounded-2xl border border-white/25 text-white font-semibold text-base hover:bg-white/10 transition-all cursor-pointer"
              >
                Lihat Layanan
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 animate-fadeInUp delay-400">
              {[
                { num: '4+', label: 'Kategori Layanan' },
                { num: '15+', label: 'Jenis Layanan' },
                { num: '5 Mnt', label: 'Proses Tercepat' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-['Playfair_Display'] text-3xl font-black text-amber-400">
                    {s.num}
                  </div>
                  <div className="text-white/50 text-xs font-medium mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Enhanced dengan multiple images */}
          <div className="space-y-6 animate-fadeInUp delay-300">
            {/* Main Image Card - Enhanced dengan overlay yang lebih menarik */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 via-emerald-500/30 to-amber-400/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20">
                {/* Gambar dengan efek parallax */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img 
                    src={kemenagGowa} 
                    alt="Kantor Kementerian Agama Kabupaten Gowa"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-emerald-500/10"></div>
                  
                  {/* Logo/Insignia Overlay - Enhanced */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-400/20 backdrop-blur-md flex items-center justify-center border border-amber-400/40 shadow-lg">
                        <span className="text-amber-400 font-bold text-2xl">K</span>
                      </div>
                      <div>
                        <p className="text-white/80 text-xs font-medium tracking-wide">KANTOR KEMENTERIAN AGAMA</p>
                        <p className="text-amber-400 font-bold text-sm tracking-wide">KABUPATEN GOWA</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Bar - Enhanced */}
                <div className="p-4 bg-gradient-to-r from-amber-950/50 to-emerald-950/50 backdrop-blur-sm border-t border-white/10">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-white/70 text-xs font-medium">Zona Integritas</span>
                      <span className="text-white/40 text-xs">•</span>
                      <span className="text-white/70 text-xs">WBK/WBBM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-white/70 text-xs">Jl. KH. Agussalim No. 3 Sungguminasa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Track Steps Card - Enhanced dengan background pattern */}
            <div className="glass-card rounded-3xl p-7 relative overflow-hidden">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-2 mb-5 relative z-10">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400/20">
                  <Zap size={14} className="text-amber-400" />
                </div>
                <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">
                  Alur Fast Track
                </span>
              </div>

              <div className="space-y-0 relative z-10">
                {FAST_TRACK_STEPS.map((step, i) => (
                  <div key={step.num} className="flex gap-4 items-start group">
                    <div className="flex flex-col items-start">
                      <div className="w-9 h-9 rounded-xl gold-btn flex items-start justify-center text-[#022c1e] font-black text-sm shadow-md flex-shrink-0 transform group-hover:scale-105 transition-transform">
                        {step.num}
                      </div>
                      {i < FAST_TRACK_STEPS.length - 1 && (
                        <div className="w-px flex-1 bg-gradient-to-b from-amber-400/40 to-emerald-500/20 my-1 min-h-[20px]" />
                      )}
                    </div>
                    <div className={`pb-4 ${i < FAST_TRACK_STEPS.length - 1 ? 'pb-5' : ''}`}>
                      <p className="text-white  text-start font-bold text-sm group-hover:text-amber-400 transition-colors">
                        {step.title}
                      </p>
                      <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3 relative z-10">
                <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                <p className="text-white/60 text-xs">
                  Dokumen siap tanpa masuk antrean reguler
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}