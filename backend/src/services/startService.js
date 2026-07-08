/**
 * Keyword for /start message
 *
 * @returns {string} 
 */
export const startKeyword = () => {
  return `
🤖 *SELAMAT DATANG DI RUANGSENSE BOT* 🤖
━━━━━━━━━━━━━━━━━━━━━━━━

Sistem asisten pintar untuk monitoring kondisi ruangan berbasis IoT.

⚠️ *PEMBERITAHUAN PENTING:*
Sebelum menggunakan fitur monitoring, Anda *WAJIB* menautkan nomor WhatsApp ini dengan ID perangkat IoT Anda menggunakan perintah:
👉 \`!set [id_device]\` (Contoh: \`!set device_01\`)

Berikut adalah daftar perintah lengkap yang dapat Anda gunakan setelah perangkat berhasil ditautkan:

🔹 *Manajemen & Bantuan*
• \`!set [id_device]\` : Menghubungkan nomor WhatsApp dengan ID perangkat IoT.
• \`!start\` : Menampilkan pesan sambutan awal ini.
• \`!help\` : Menampilkan panduan dan bantuan penggunaan bot.

🔹 *Monitoring Sensor (Real-time)*
• \`!suhu\` : Mengecek kondisi suhu terbaru di ruangan.
• \`!kelembapan\` : Mengecek tingkat kelembapan terbaru.
• \`!gas\` : Mengecek kadar kebocoran gas/indeks asap terbaru.
• \`!status\` : Mengecek ringkasan status kelistrikan dan kesehatan perangkat.

🔹 *Analisis Data & Grafik*
• \`!grafik [periode]\` : Merender grafik analisis multivariabel (Contoh: \`!grafik 1d\`, \`!grafik 7d\`).

🔹 *Konfigurasi Peringatan (Threshold)*
• \`!set-warning [opsi] [nilai]\` : Mengubah ambang batas bahaya sensor langsung ke perangkat via server.
  _(Pilihan opsi: temp / gas / buzzer)_

🚨 *Sistem Peringatan Otomatis (Alert):*
Bot akan otomatis mengirimkan pesan darurat (bencana/bahaya) jika sensor mendeteksi adanya suhu tinggi atau kebocoran gas yang melebihi ambang batas aman di ruangan Anda!`.trim();
}

/**
 * Keyword for /help message
 *
 * @returns {string} 
 */
export const helpKeyword = () => {
  return `
💡 *PANDUAN PENGGUNAAN RUANGSENSE BOT* 💡
━━━━━━━━━━━━━━━━━━━━━━━━

Mengalami kendala dalam menggunakan bot atau perangkat? Ikuti panduan ringkas berikut:

1️⃣ *Tautkan Perangkat Terlebih Dahulu*
Jika bot membalas dengan peringatan *"Perangkat belum ditautkan"*, ketik \`!set [id_device]\` menggunakan ID perangkat yang tertera pada modul fisik Anda.

2️⃣ *Format Perintah Operasional*
Pastikan Anda mengetikkan perintah dengan benar menggunakan tanda seru (\`!\`) di depan kata:
• Ingin tahu kondisi ruangan secara instan? Ketik \`!status\`, \`!suhu\`, \`!kelembapan\`, atau \`!gas\`.
• Ingin melihat tren grafik? Ketik \`!grafik 1d\` (untuk 1 hari) atau \`!grafik 7d\` (untuk 1 minggu).
• Ingin mengubah batas alarm buzzer? Ketik \`!set-warning buzzer off\` atau \`!set-warning buzzer on\`.

3️⃣ *Masalah Konektivitas Perangkat*
Jika indikator status menunjukkan 🔴 *Offline*, silakan periksa:
• Sambungan daya adaptor pada perangkat keras IoT Anda.
• Koneksi internet WiFi di area ruangan tempat perangkat diletakkan.

Gunakan perintah \`!start\` kapan saja untuk melihat ringkasan visual menu petunjuk perintah utama.`.trim();
}