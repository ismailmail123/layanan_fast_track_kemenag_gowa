// Gallery.jsx - Komponen baru untuk galeri gambar
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import kemenagGowa from '../assets/kemenag_gowa.jpeg';
import layanan1 from '../assets/layanan1.jpg';
import layanan2 from '../assets/layanan2.jpg';
import layanan3 from '../assets/layanan3.jpg';
import ruangTunggu from '../assets/ruang_tunggu.jpg';
import loket from '../assets/loket.jpg';

const GALLERY_IMAGES = [
  {
    id: 1,
    src: kemenagGowa,
    title: 'Kantor Kemenag Gowa',
    caption: 'Gedung pelayanan terpadu Kementerian Agama Kabupaten Gowa',
    category: 'Eksterior'
  },
  {
    id: 2,
    src: layanan1,
    title: 'Loket Fast Track',
    caption: 'Layanan prioritas dengan sistem antrean digital',
    category: 'Pelayanan'
  },
  {
    id: 3,
    src: ruangTunggu,
    title: 'Ruang Tunggu Premium',
    caption: 'Area tunggu yang nyaman dengan fasilitas lengkap',
    category: 'Fasilitas'
  },
  {
    id: 4,
    src: loket,
    title: 'Proses Verifikasi',
    caption: 'Petugas profesional siap melayani Anda',
    category: 'Pelayanan'
  },
  {
    id: 5,
    src: layanan2,
    title: 'Layanan Administrasi',
    caption: 'Proses administrasi yang cepat dan akurat',
    category: 'Pelayanan'
  },
  {
    id: 6,
    src: layanan3,
    title: 'Fasilitas Digital',
    caption: 'Sistem informasi terintegrasi untuk pelayanan optimal',
    category: 'Fasilitas'
  }
];

function Lightbox({ image, onClose, onNext, onPrev }) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-lg flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-10"
      >
        <X size={20} className="text-white" />
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-10"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-10"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      <div className="max-w-[90vw] max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.src}
          alt={image.title}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
          <h3 className="text-white font-bold text-xl mb-1">{image.title}</h3>
          <p className="text-white/70 text-sm">{image.caption}</p>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  const categories = ['Semua', ...new Set(GALLERY_IMAGES.map(img => img.category))];
  
  const filteredImages = activeCategory === 'Semua' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === activeCategory);

  const currentIndex = selectedImage ? GALLERY_IMAGES.findIndex(img => img.id === selectedImage.id) : -1;

  const handleNext = () => {
    if (currentIndex < GALLERY_IMAGES.length - 1) {
      setSelectedImage(GALLERY_IMAGES[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(GALLERY_IMAGES[currentIndex - 1]);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-3">
            Galeri Kami
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Suasana & <span className="text-emerald-600">Fasilitas</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Lihat langsung suasana pelayanan dan fasilitas modern yang kami sediakan untuk kenyamanan Anda.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, idx) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-2xl cursor-pointer animate-fadeInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                    <p className="text-white font-bold text-sm">{image.title}</p>
                    <p className="text-white/70 text-xs mt-1">{image.caption}</p>
                  </div>
                </div>
                
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </div>
    </section>
  );
}