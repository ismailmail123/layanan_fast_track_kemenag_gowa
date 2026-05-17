export const JENIS_LAYANAN = [{
        id: 'fasttrack',
        label: 'Fast Track',
        icon: '⚡',
        color: 'emerald',
        tag: 'Prioritas',
        desc: 'Layanan prioritas tanpa antre panjang di loket reguler',
        items: [
            { name: 'Legalisir Dokumen Pendidikan', },
            { name: 'Legalisir Dokumen Keagamaan', },
            { name: 'Legalisir Dokumen Administrasi', },
            { name: 'Pengambilan Berkas Jadi' },
            { name: 'Pengambilan Surat Keluar' },
        ],
    },
    {
        id: 'pendidikan',
        label: 'Pendidikan & Madrasah',
        icon: '🎓',
        color: 'blue',
        tag: 'Pendidikan',
        desc: 'Layanan administrasi pendidikan dan madrasah',
        items: [
            { name: 'Rekomendasi Calon Kepala Madrasah', },
            { name: 'Mutasi Guru dan Tendik', },
            { name: 'Rekomendasi Bantuan Lembaga & Siswa', },
            { name: 'Rekomendasi Izin Belajar Siswa Keluar Negeri', },
            { name: 'Surat Keterangan Mutasi Siswa', },
            { name: 'Rekomendasi Izin Operasional Madrasah' },
            { name: 'Rekomendasi Akreditasi RA/Madrasah', },
        ],
    },
    {
        id: 'bimas',
        label: 'Bimas Islam',
        icon: '🕌',
        color: 'teal',
        tag: 'Keagamaan',
        desc: 'Layanan bimbingan masyarakat Islam',
        items: [
            { name: 'Keterangan Terdaftar Mesjid/Mushollah', },
            { name: 'Rekomendasi Bantuan Mesjid/Mushollah', },
            { name: 'Keterangan Terdaftar Majelis Taklim', },
        ],
    },
    {
        id: 'pai',
        label: 'Layanan PAI',
        icon: '📚',
        color: 'amber',
        tag: 'PAI',
        desc: 'Layanan pendidikan agama Islam',
        items: [
            { name: 'Aktivasi Akun Emis Pendis' },
            { name: 'Aktivasi Akun Siaga Pendis' },
            { name: 'Dispensasi Kelayakan Tunjangan GPAI' },
        ],
    },
];

export const FAST_TRACK_STEPS = [{
        num: 1,
        icon: '👤',
        title: 'Daftar Online / Datang Langsung',
        desc: 'Isi formulir dan siapkan dokumen persyaratan.',
    },
    {
        num: 2,
        icon: '✅',
        title: 'Verifikasi Cepat',
        desc: 'Petugas melakukan pemeriksaan dokumen.',
    },
    {
        num: 3,
        icon: '⚙️',
        title: 'Dokumen Diproses',
        desc: 'Proses instan sesuai jenis layanan.',
    },
    {
        num: 4,
        icon: '🔔',
        title: 'Notifikasi Selesai',
        desc: 'Pemohon menerima pemberitahuan dokumen siap diambil.',
    },
    {
        num: 5,
        icon: '🏢',
        title: 'Ambil di Loket Fast Track',
        desc: 'Pengambilan dokumen di loket prioritas tanpa masuk antrean reguler.',
    },
];

export const PROSEDUR = [
    'Membawa dokumen persyaratan',
    'Mengisi formulir online / offline',
    'Verifikasi oleh petugas Fast Track',
    'Menunggu notifikasi selesai',
    'Pengambilan langsung di loket prioritas',
];

export const ONLINE_STEPS = [
    { icon: '☁️', label: 'Upload Berkas' },
    { icon: '🔍', label: 'Verifikasi Digital' },
    { icon: '📨', label: 'Terima Notifikasi' },
    { icon: '🧾', label: 'Ambil Dokumen' },
];

export const OFFLINE_STEPS = [
    { icon: '📍', label: 'Datang ke Loket Prioritas' },
    { icon: '✅', label: 'Verifikasi Cepat' },
    { icon: '⚡', label: 'Proses Instan' },
    { icon: '📄', label: 'Dokumen Selesai' },
];

export const COLOR_MAP = {
    emerald: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-800',
        border: 'border-emerald-200',
        icon: 'bg-emerald-100',
        time: 'bg-emerald-50 text-emerald-700',
        accent: 'bg-emerald-600',
    },
    blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-800',
        border: 'border-blue-200',
        icon: 'bg-blue-100',
        time: 'bg-blue-50 text-blue-700',
        accent: 'bg-blue-600',
    },
    teal: {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        badge: 'bg-teal-100 text-teal-800',
        border: 'border-teal-200',
        icon: 'bg-teal-100',
        time: 'bg-teal-50 text-teal-700',
        accent: 'bg-teal-600',
    },
    amber: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-800',
        border: 'border-amber-200',
        icon: 'bg-amber-100',
        time: 'bg-amber-50 text-amber-700',
        accent: 'bg-amber-500',
    },
};