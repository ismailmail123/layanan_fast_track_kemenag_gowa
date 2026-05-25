// ============================================================
// utils/barcode.js - Encode/Decode Barcode Data dengan Base64
// ============================================================

/**
 * Encode data titik ke Base64 untuk isi QR Code
 * Format: nama|lat|lng
 */
export const encodeBarcode = (nama, latitude, longitude) => {
    const raw = `${nama}|${latitude}|${longitude}`;
    return btoa(unescape(encodeURIComponent(raw)));
};

/**
 * Decode Base64 dari hasil scan QR Code
 * Returns: { nama, latitude, longitude } atau null jika invalid
 */
export const decodeBarcode = (encoded) => {
    try {
        const decoded = decodeURIComponent(escape(atob(encoded)));
        const parts = decoded.split('|');
        if (parts.length !== 3) return null;

        const [nama, lat, lng] = parts;
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || isNaN(longitude)) return null;
        if (latitude < -90 || latitude > 90) return null;
        if (longitude < -180 || longitude > 180) return null;

        return { nama, latitude, longitude };
    } catch {
        return null;
    }
};

// ============================================================
// utils/geolocation.js - Kalkulasi jarak GPS
// ============================================================

/**
 * Hitung jarak antara dua koordinat menggunakan Haversine Formula
 * Returns: jarak dalam meter
 */
export const hitungJarak = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // radius bumi dalam meter
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

/**
 * Dapatkan posisi GPS petugas saat ini
 * Returns Promise: { latitude, longitude, accuracy }
 */
export const dapatkanPosisi = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('GPS tidak tersedia di perangkat ini'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy
            }),
            (err) => {
                const pesan = {
                    1: 'Akses GPS ditolak. Izinkan akses lokasi di pengaturan browser.',
                    2: 'Sinyal GPS tidak tersedia. Coba di luar ruangan.',
                    3: 'Waktu GPS habis. Coba lagi.'
                };
                reject(new Error(pesan[err.code] || 'GPS error'));
            }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
        );
    });
};

// ============================================================
// utils/sesi.js - Logika sesi patroli WITA
// ============================================================

export const SESI_CONFIG = [{
        id: 'SESI 1',
        label: 'Sesi 1',
        jam: '00:01 – 07:00',
        warna: '#1e40af',
        warnaLight: '#dbeafe',
        icon: '🌙',
        startH: 0,
        startM: 1,
        endH: 7,
        endM: 0
    },
    {
        id: 'SESI 2',
        label: 'Sesi 2',
        jam: '07:01 – 13:00',
        warna: '#d97706',
        warnaLight: '#fef3c7',
        icon: '🌅',
        startH: 7,
        startM: 1,
        endH: 13,
        endM: 0
    },
    {
        id: 'SESI 3',
        label: 'Sesi 3',
        jam: '13:01 – 19:00',
        warna: '#059669',
        warnaLight: '#d1fae5',
        icon: '☀️',
        startH: 13,
        startM: 1,
        endH: 19,
        endM: 0
    },
    {
        id: 'SESI 4',
        label: 'Sesi 4',
        jam: '19:01 – 00:00',
        warna: '#7c3aed',
        warnaLight: '#ede9fe',
        icon: '🌆',
        startH: 19,
        startM: 1,
        endH: 23,
        endM: 59
    }
];

export const getSesiSaatIni = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const total = h * 60 + m;

    if (total >= 1 && total <= 420) return 'SESI 1';
    if (total >= 421 && total <= 780) return 'SESI 2';
    if (total >= 781 && total <= 1140) return 'SESI 3';
    return 'SESI 4';
};

export const formatTanggal = (date = new Date()) => {
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatTanggalPendek = (date = new Date()) => {
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).split('/').join('/');
};

export const formatWaktu = (date = new Date()) => {
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
};