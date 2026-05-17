// export const JENIS_LAYANAN = [{
//         id: 'fasttrack',
//         label: 'Fast Track',
//         icon: '⚡',
//         color: 'emerald',
//         tag: 'Prioritas',
//         desc: 'Layanan prioritas tanpa antre panjang di loket reguler',
//         items: [
//             { name: 'Legalisir Dokumen Pendidikan', },
//             { name: 'Legalisir Dokumen Keagamaan', },
//             { name: 'Legalisir Dokumen Administrasi', },
//             { name: 'Pengambilan Berkas Jadi' },
//             { name: 'Pengambilan Surat Keluar' },
//         ],
//     },
//     {
//         id: 'pendidikan',
//         label: 'Pendidikan & Madrasah',
//         icon: '🎓',
//         color: 'blue',
//         tag: 'Pendidikan',
//         desc: 'Layanan administrasi pendidikan dan madrasah',
//         items: [
//             { name: 'Rekomendasi Calon Kepala Madrasah', },
//             { name: 'Mutasi Guru dan Tendik', },
//             { name: 'Rekomendasi Bantuan Lembaga & Siswa', },
//             { name: 'Rekomendasi Izin Belajar Siswa Keluar Negeri', },
//             { name: 'Surat Keterangan Mutasi Siswa', },
//             { name: 'Rekomendasi Izin Operasional Madrasah' },
//             { name: 'Rekomendasi Akreditasi RA/Madrasah', },
//         ],
//     },
//     {
//         id: 'bimas',
//         label: 'Bimas Islam',
//         icon: '🕌',
//         color: 'teal',
//         tag: 'Keagamaan',
//         desc: 'Layanan bimbingan masyarakat Islam',
//         items: [
//             { name: 'Keterangan Terdaftar Mesjid/Mushollah', },
//             { name: 'Rekomendasi Bantuan Mesjid/Mushollah', },
//             { name: 'Keterangan Terdaftar Majelis Taklim', },
//         ],
//     },
//     {
//         id: 'pai',
//         label: 'Layanan PAI',
//         icon: '📚',
//         color: 'amber',
//         tag: 'PAI',
//         desc: 'Layanan pendidikan agama Islam',
//         items: [
//             { name: 'Aktivasi Akun Emis Pendis' },
//             { name: 'Aktivasi Akun Siaga Pendis' },
//             { name: 'Dispensasi Kelayakan Tunjangan GPAI' },
//         ],
//     },
// ];

// export const FAST_TRACK_STEPS = [{
//         num: 1,
//         icon: '👤',
//         title: 'Daftar Online / Datang Langsung',
//         desc: 'Isi formulir dan siapkan dokumen persyaratan.',
//     },
//     {
//         num: 2,
//         icon: '✅',
//         title: 'Verifikasi Cepat',
//         desc: 'Petugas melakukan pemeriksaan dokumen.',
//     },
//     {
//         num: 3,
//         icon: '⚙️',
//         title: 'Dokumen Diproses',
//         desc: 'Proses instan sesuai jenis layanan.',
//     },
//     {
//         num: 4,
//         icon: '🔔',
//         title: 'Notifikasi Selesai',
//         desc: 'Pemohon menerima pemberitahuan dokumen siap diambil.',
//     },
//     {
//         num: 5,
//         icon: '🏢',
//         title: 'Ambil di Loket Fast Track',
//         desc: 'Pengambilan dokumen di loket prioritas tanpa masuk antrean reguler.',
//     },
// ];

// export const PROSEDUR = [
//     'Membawa dokumen persyaratan',
//     'Mengisi formulir online / offline',
//     'Verifikasi oleh petugas Fast Track',
//     'Menunggu notifikasi selesai',
//     'Pengambilan langsung di loket prioritas',
// ];

// export const ONLINE_STEPS = [
//     { icon: '☁️', label: 'Upload Berkas' },
//     { icon: '🔍', label: 'Verifikasi Digital' },
//     { icon: '📨', label: 'Terima Notifikasi' },
//     { icon: '🧾', label: 'Ambil Dokumen' },
// ];

// export const OFFLINE_STEPS = [
//     { icon: '📍', label: 'Datang ke Loket Prioritas' },
//     { icon: '✅', label: 'Verifikasi Cepat' },
//     { icon: '⚡', label: 'Proses Instan' },
//     { icon: '📄', label: 'Dokumen Selesai' },
// ];

// export const COLOR_MAP = {
//     emerald: {
//         bg: 'bg-emerald-50',
//         text: 'text-emerald-700',
//         badge: 'bg-emerald-100 text-emerald-800',
//         border: 'border-emerald-200',
//         icon: 'bg-emerald-100',
//         time: 'bg-emerald-50 text-emerald-700',
//         accent: 'bg-emerald-600',
//     },
//     blue: {
//         bg: 'bg-blue-50',
//         text: 'text-blue-700',
//         badge: 'bg-blue-100 text-blue-800',
//         border: 'border-blue-200',
//         icon: 'bg-blue-100',
//         time: 'bg-blue-50 text-blue-700',
//         accent: 'bg-blue-600',
//     },
//     teal: {
//         bg: 'bg-teal-50',
//         text: 'text-teal-700',
//         badge: 'bg-teal-100 text-teal-800',
//         border: 'border-teal-200',
//         icon: 'bg-teal-100',
//         time: 'bg-teal-50 text-teal-700',
//         accent: 'bg-teal-600',
//     },
//     amber: {
//         bg: 'bg-amber-50',
//         text: 'text-amber-700',
//         badge: 'bg-amber-100 text-amber-800',
//         border: 'border-amber-200',
//         icon: 'bg-amber-100',
//         time: 'bg-amber-50 text-amber-700',
//         accent: 'bg-amber-500',
//     },
// };

export const JENIS_LAYANAN = [{
        id: 'fasttrack',
        label: 'Fast Track',
        icon: '⚡',
        color: 'emerald',
        tag: 'Prioritas',
        desc: 'Layanan prioritas tanpa antre panjang di loket reguler',
        items: [
            { name: 'Legalisir Dokumen Pendidikan' },
            { name: 'Legalisir Dokumen Keagamaan' },
            { name: 'Legalisir Dokumen Administrasi' },
            { name: 'Pengambilan Berkas Jadi' },
            { name: 'Pengambilan Surat Keluar' },
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
            { name: 'Permohonan Keterangan Terdaftar Masjid/Mushalla' },
            { name: 'Permohonan Rekomendasi Bantuan Masjid/Mushalla' },
            { name: 'Permohonan Keterangan Terdaftar Majelis Taklim' },
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
            { name: 'Rekomendasi Calon Kepala Madrasah' },
            { name: 'Rekomendasi Izin Belajar Siswa Keluar Negeri' },
            { name: 'Surat Keterangan Mutasi Siswa' },
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
    {
        id: 'diniyah',
        label: 'Pendidikan Diniyah & Ponpes',
        icon: '🏫',
        color: 'purple',
        tag: 'Diniyah',
        desc: 'Layanan pendidikan diniyah dan pondok pesantren',
        items: [
            { name: 'Surat Rekomendasi Izin Belajar Luar Negeri' },
            { name: 'Pengesahan Ijazah/Sertifikat TPQ, RTQ, MDT dan Pondok Pesantren' },
        ],
    },
    {
        id: 'zakatwakaf',
        label: 'Zakat & Wakaf',
        icon: '🤲',
        color: 'green',
        tag: 'Wakaf',
        desc: 'Layanan administrasi zakat dan wakaf',
        items: [
            { name: 'Surat Permohonan Wakaf' },
            { name: 'Surat Permohonan Wakif' },
            { name: 'Surat Keterangan Riwayat Tanah' },
            { name: 'Blangko Kelengkapan Sertifikat Tanah Wakaf' },
        ],
    },
    {
        id: 'kepegawaian',
        label: 'Kepegawaian',
        icon: '👔',
        color: 'slate',
        tag: 'Kepegawaian',
        desc: 'Layanan administrasi kepegawaian',
        items: [
            { name: 'Pengambilan Formulir Surat Cuti' },
            { name: 'Surat Tugas dan Rekomendasi' },
        ],
    },
    {
        id: 'keuangan',
        label: 'Keuangan',
        icon: '💰',
        color: 'orange',
        tag: 'Keuangan',
        desc: 'Layanan administrasi keuangan',
        items: [
            { name: 'Permohonan dan Pengesahan Daftar Gaji, Tukin dan Uang Makan' },
            { name: 'Form Perincian Gaji' },
            { name: 'Permohonan Form A2' },
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
    purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-800',
        border: 'border-purple-200',
        icon: 'bg-purple-100',
        time: 'bg-purple-50 text-purple-700',
        accent: 'bg-purple-600',
    },
    green: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        badge: 'bg-green-100 text-green-800',
        border: 'border-green-200',
        icon: 'bg-green-100',
        time: 'bg-green-50 text-green-700',
        accent: 'bg-green-600',
    },
    slate: {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        badge: 'bg-slate-100 text-slate-800',
        border: 'border-slate-200',
        icon: 'bg-slate-100',
        time: 'bg-slate-50 text-slate-700',
        accent: 'bg-slate-600',
    },
    orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-800',
        border: 'border-orange-200',
        icon: 'bg-orange-100',
        time: 'bg-orange-50 text-orange-700',
        accent: 'bg-orange-500',
    },
};