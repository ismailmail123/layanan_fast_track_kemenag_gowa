import { Menu, X, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

const NAV_LINKS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'layanan', label: 'Layanan' },
  { id: 'alur', label: 'Alur & Prosedur' },
  { id: 'daftar', label: 'Daftar' },
];

export default function Navbar() {
  const { activeSection, mobileMenuOpen, setActiveSection, toggleMobileMenu, closeMobileMenu } =
    useStore();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    closeMobileMenu();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#022c1e]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-btn flex items-center justify-center shadow-lg">
              <Zap size={18} className="text-[#022c1e] font-bold" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight tracking-tight">
                KEMENAG FAST TRACK
              </p>
              <p className="text-emerald-400 text-[10px] font-medium tracking-widest uppercase">
                Layanan Prioritas
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-600 transition-all duration-200 cursor-pointer ${
                  activeSection === link.id
                    ? 'nav-link-active font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          {/* <div className="hidden md:block">
            <button
              onClick={() => scrollTo('daftar')}
              className="gold-btn px-5 py-2 rounded-xl text-[#022c1e] font-bold text-sm shadow-lg cursor-pointer"
            >
              Daftar Sekarang →
            </button>
          </div> */}

          {/* Mobile menu btn */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white/80 hover:text-white p-2 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#022c1e] border-t border-white/10 animate-fadeInUp">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === link.id
                    ? 'bg-amber-400 text-[#022c1e]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('daftar')}
              className="w-full gold-btn px-4 py-3 rounded-xl text-[#022c1e] font-bold text-sm mt-2 cursor-pointer"
            >
              Daftar Sekarang →
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}