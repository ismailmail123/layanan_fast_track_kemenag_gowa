import { create } from 'zustand';

export const useStore = create((set, get) => ({
    // Navigation
    activeSection: 'beranda',
    mobileMenuOpen: false,

    // Service modal
    activeModal: null,

    // Tab state for "Cara Kerja"
    activeTab: 'online',

    // Toast notification
    toast: null,

    // Registration form data
    formData: {
        nama: '',
        nik: '',
        email: '',
        telepon: '',
        kategoriLayanan: '',
        jenisLayanan: '',
        keperluan: '',
        tanggalKunjungan: '',
        metodePengambilan: 'langsung',
    },

    formErrors: {},
    formSubmitting: false,
    formSubmitted: false,

    // Actions
    setActiveSection: (section) => set({ activeSection: section }),
    toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
    closeMobileMenu: () => set({ mobileMenuOpen: false }),

    openModal: (id) => set({ activeModal: id }),
    closeModal: () => set({ activeModal: null }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    showToast: (message, type = 'success') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 4000);
    },

    setFormField: (field, value) =>
        set((s) => ({
            formData: {...s.formData, [field]: value },
            formErrors: {...s.formErrors, [field]: '' },
        })),

    resetForm: () =>
        set({
            formData: {
                nama: '',
                nik: '',
                email: '',
                telepon: '',
                kategoriLayanan: '',
                jenisLayanan: '',
                keperluan: '',
                tanggalKunjungan: '',
                metodePengambilan: 'langsung',
            },
            formErrors: {},
            formSubmitted: false,
        }),

    validateForm: () => {
        const { formData } = get();
        const errors = {};
        if (!formData.nama.trim()) errors.nama = 'Nama wajib diisi';
        if (!formData.nik.trim() || formData.nik.length !== 16)
            errors.nik = 'NIK harus 16 digit';
        if (!formData.email.includes('@')) errors.email = 'Email tidak valid';
        if (!formData.telepon.trim()) errors.telepon = 'Nomor telepon wajib diisi';
        if (!formData.kategoriLayanan) errors.kategoriLayanan = 'Pilih kategori layanan';
        if (!formData.jenisLayanan) errors.jenisLayanan = 'Pilih jenis layanan';
        if (!formData.tanggalKunjungan) errors.tanggalKunjungan = 'Pilih tanggal kunjungan';
        set({ formErrors: errors });
        return Object.keys(errors).length === 0;
    },

    submitToGoogleForm: () => {
        const { formData, validateForm, showToast } = get();
        if (!validateForm()) {
            showToast('Mohon lengkapi semua field yang wajib diisi.', 'error');
            return;
        }
        set({ formSubmitting: true });

        // Google Form URL — ganti dengan ID form Anda yang sebenarnya
        const GOOGLE_FORM_URL =
            'https://docs.google.com/forms/d/e/1FAIpQLSdVVEkZPKj3mEPwjOnozziQLClqyauKOkcGAt_-ubKzFmI0_A/formResponse';

        // Mapping ke entry ID Google Form Anda yang baru
        const params = new URLSearchParams({
            'entry.973285098': formData.nama, // Nama
            'entry.810129312': formData.nik, // NIK
            'entry.2094800247': formData.email, // Email
            'entry.268483567': formData.telepon, // Telepon
            'entry.92241857': formData.kategoriLayanan, // Kategory Layanan
            'entry.895825738': formData.jenisLayanan, // Jenis Layanan
            'entry.1412550657': formData.keperluan, // Keperluan
            'entry.1714040312': formData.tanggalKunjungan, // Tanggal Kunjungan
            'entry.1021572649': formData.metodePengambilan, // Metode Pengambilan
        });

        // Buka Google Form pre-filled di tab baru
        const prefilledUrl = `${GOOGLE_FORM_URL.replace('/formResponse', '/viewform')}?${params.toString()}`;
        window.open(prefilledUrl, '_blank');

        setTimeout(() => {
            set({ formSubmitting: false, formSubmitted: true });
            showToast('✅ Pendaftaran berhasil! Silakan lengkapi formulir di tab baru.', 'success');
        }, 800);
    },
}));