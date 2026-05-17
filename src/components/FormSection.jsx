import { Send, CheckCircle, RotateCcw, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { JENIS_LAYANAN } from '../services/ContactService';

const LAYANAN_OPTIONS = {
  fasttrack: [
    'Legalisir Dokumen Pendidikan',
    'Legalisir Dokumen Keagamaan',
    'Legalisir Dokumen Administrasi',
    'Pengambilan Berkas Jadi',
    'Pengambilan Surat Keluar',
  ],
  pendidikan: [
    'Rekomendasi Calon Kepala Madrasah',
    'Mutasi Guru dan Tendik',
    'Rekomendasi Bantuan Lembaga & Siswa',
    'Rekomendasi Izin Belajar Siswa Keluar Negeri',
    'Surat Keterangan Mutasi Siswa',
    'Rekomendasi Izin Operasional Madrasah',
    'Rekomendasi Akreditasi RA/Madrasah',
  ],
  bimas: [
    'Keterangan Terdaftar Mesjid/Mushollah',
    'Rekomendasi Bantuan Mesjid/Mushollah',
    'Keterangan Terdaftar Majelis Taklim',
  ],
  pai: [
    'Aktivasi Akun Emis Pendis',
    'Aktivasi Akun Siaga Pendis',
    'Dispensasi Kelayakan Tunjangan GPAI',
  ],
};

function InputField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm text-start font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function FormSection() {
  const {
    formData,
    formErrors,
    formSubmitting,
    formSubmitted,
    setFormField,
    submitToGoogleForm,
    resetForm,
  } = useStore();

  const jenisOptions = formData.kategoriLayanan
    ? LAYANAN_OPTIONS[formData.kategoriLayanan] || []
    : [];

  if (formSubmitted) {
    return (
      <section id="daftar" className="py-24 bg-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl font-black text-gray-900 mb-4">
            Pendaftaran Berhasil!
          </h2>
          <p className="text-gray-500 text-lg mb-4 leading-relaxed">
            Formulir Google telah dibuka di tab baru. Silakan lengkapi dan kirimkan data Anda.
          </p>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Setelah pengiriman, petugas kami akan menghubungi Anda melalui nomor telepon yang terdaftar.
          </p>
          <button
            onClick={resetForm}
            className="flex items-center gap-2 mx-auto green-btn text-white font-bold px-8 py-3.5 rounded-2xl cursor-pointer"
          >
            <RotateCcw size={16} />
            Daftar Lagi
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="daftar" className="py-24">
      <div
        className="hero-bg"
        style={{ background: 'linear-gradient(150deg, #022c1e 0%, #064e3b 50%, #065f46 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left info */}
            <div>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                Pendaftaran Layanan
              </p>
              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                Daftar <span className="shimmer-text">Sekarang</span>,<br />
                Proses Lebih <span className="text-emerald-400">Cepat</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Isi formulir pendaftaran di bawah ini. Data Anda akan disimpan dengan aman melalui
                Google Forms dan diproses oleh petugas kami.
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                {[
                  { icon: '⚡', title: 'Proses Kilat', desc: 'Dokumen diproses lebih cepat dari loket reguler' },
                  { icon: '🎯', title: 'Loket Prioritas', desc: 'Tidak perlu antre panjang di loket biasa' },
                  { icon: '🔔', title: 'Notifikasi Otomatis', desc: 'Terima pemberitahuan saat dokumen siap diambil' },
                  { icon: '🔒', title: 'Data Aman', desc: 'Informasi Anda tersimpan aman di Google Forms' },
                ].map((b) => (
                  <div key={b.title} className="flex items-start gap-4 glass-card rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/15 flex items-center justify-center text-xl flex-shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <p className="text-white text-start font-bold text-sm">{b.title}</p>
                      <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="font-['Playfair_Display'] text-2xl font-black text-gray-900 mb-1">
                Formulir Pendaftaran
              </h3>
              <p className="text-gray-400 text-sm mb-7">
                Data ini akan dikirim ke Google Forms untuk diproses
              </p>

              <div className="space-y-5">
                {/* Nama Lengkap */}
                <InputField label="Nama Lengkap" required error={formErrors.nama}>
                  <input
                    type="text"
                    className="form-input-custom w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama}
                    onChange={(e) => setFormField('nama', e.target.value)}
                  />
                </InputField>

                {/* NIK & Telepon */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="NIK" required error={formErrors.nik}>
                    <input
                      type="text"
                      className="form-input-custom w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      maxLength={16}
                      placeholder="16 digit NIK"
                      value={formData.nik}
                      onChange={(e) => setFormField('nik', e.target.value.replace(/\D/g, ''))}
                    />
                  </InputField>

                  <InputField label="No. Telepon" required error={formErrors.telepon}>
                    <input
                      type="tel"
                      className="form-input-custom w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      placeholder="08xxxxxxxxxx"
                      value={formData.telepon}
                      onChange={(e) => setFormField('telepon', e.target.value)}
                    />
                  </InputField>
                </div>

                {/* Email */}
                <InputField label="Email" required error={formErrors.email}>
                  <input
                    type="email"
                    className="form-input-custom w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChange={(e) => setFormField('email', e.target.value)}
                  />
                </InputField>

                {/* Kategori Layanan */}
                <InputField label="Kategori Layanan" required error={formErrors.kategoriLayanan}>
                  <div className="relative">
                    <select
                      className="form-input-custom w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none pr-10"
                      value={formData.kategoriLayanan}
                      onChange={(e) => {
                        setFormField('kategoriLayanan', e.target.value);
                        setFormField('jenisLayanan', '');
                      }}
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {JENIS_LAYANAN.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.icon} {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </InputField>

                {/* Jenis Layanan */}
                <InputField label="Jenis Layanan" required error={formErrors.jenisLayanan}>
                  <div className="relative">
                    <select
                      className="form-input-custom w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={formData.jenisLayanan}
                      onChange={(e) => setFormField('jenisLayanan', e.target.value)}
                      disabled={!formData.kategoriLayanan}
                    >
                      <option value="">-- Pilih Jenis Layanan --</option>
                      {jenisOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </InputField>

                {/* Tanggal & Metode */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Tanggal Kunjungan" required error={formErrors.tanggalKunjungan}>
                    <input
                      type="date"
                      className="form-input-custom w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      value={formData.tanggalKunjungan}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormField('tanggalKunjungan', e.target.value)}
                    />
                  </InputField>

                  <InputField label="Metode Pengambilan">
                    <div className="relative">
                      <select
                        className="form-input-custom w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all appearance-none pr-10"
                        value={formData.metodePengambilan}
                        onChange={(e) => setFormField('metodePengambilan', e.target.value)}
                      >
                        <option value="langsung">Ambil Langsung</option>
                        <option value="online">Daftar Online</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </InputField>
                </div>

                {/* Keperluan */}
                <InputField label="Keterangan / Keperluan">
                  <textarea
                    className="form-input-custom w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-y min-h-[80px]"
                    rows={3}
                    placeholder="Tuliskan keperluan atau keterangan tambahan (opsional)"
                    value={formData.keperluan}
                    onChange={(e) => setFormField('keperluan', e.target.value)}
                  />
                </InputField>

                {/* Submit Button */}
                <button
                  onClick={submitToGoogleForm}
                  disabled={formSubmitting}
                  className="w-full green-btn bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-base transition-all duration-200"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Kirim ke Google Forms
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 leading-relaxed">
                  Data Anda akan dikirim dan disimpan melalui{' '}
                  <span className="text-emerald-600 font-semibold">Google Forms</span>.
                  Petugas akan menghubungi Anda via nomor yang terdaftar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}