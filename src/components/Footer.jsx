import { Zap, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <div className="bg-[#011a12] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl gold-btn flex items-center justify-center shadow-lg">
                <Zap size={20} className="text-[#022c1e]" />
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">KEMENAG FAST TRACK</p>
                <p className="text-emerald-400 text-xs tracking-widest uppercase">Layanan Prioritas</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
              Layanan administrasi Kementerian Agama dengan sistem prioritas. Proses cepat, profesional,
              dan transparan untuk masyarakat.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot"></div>
              Layanan aktif Senin – Jumat, 08.00 – 15.00 WITA
            </div>
          </div>

          {/* Layanan */}
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">Kategori Layanan</p>
            <ul className="space-y-3">
              {[
                'Fast Track',
                'Pendidikan & Madrasah',
                'Bimas Islam',
                'Layanan PAI',
              ].map((item) => (
                <li key={item}>
                  <span className="text-white/55 text-sm hover:text-white transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">Kontak</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/55 text-sm leading-relaxed">
                  Kantor Kemenag Kota Makassar, Sulawesi Selatan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-emerald-400 flex-shrink-0" />
                <span className="text-white/55 text-sm">(0411) 000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-emerald-400 flex-shrink-0" />
                <span className="text-white/55 text-sm">info@kemenag.go.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={15} className="text-emerald-400 flex-shrink-0" />
                <span className="text-white/55 text-sm">Senin – Jumat: 08.00–15.00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 Kementerian Agama. Hak cipta dilindungi undang-undang.
          </p>
          <p className="text-white/25 text-xs">
            Dibangun untuk pelayanan masyarakat yang lebih baik.
          </p>
        </div>
      </div>
    </div>
  );
}
