
/**
 * Keyword for /start message
 *
 * @returns {string} 
 */
export const startKeyword = () => {
  return `
🤖 *DAFTAR PERINTAH BOT RUANGSENSE* 🤖

Berikut adalah perintah yang dapat Anda gunakan:

🔹 *Manajemen Perangkat*
• \`!set [id_device]\` : Menghubungkan nomor WhatsApp ini dengan ID perangkat IoT Anda.
• \`!start\` : Menampilkan pesan selamat datang awal.
• \`!help\` : Menampilkan daftar bantuan/perintah ini.

🔹 *Monitoring Sensor (Real-time)*
• \`!suhu\` : Mengecek kondisi suhu terbaru di ruangan.
• \`!kelembapan\` : Mengecek tingkat kelembapan terbaru.
• \`!gas\` : Mengecek kadar kebocoran gas terbaru.
• \`!status\` : Mengecek status ringkasan dan kesehatan perangkat.

🔹 *Analisis Data & Grafik*
• \`!grafik [periode]\` : Melihat grafik monitoring (Contoh: \`!grafik 7d\` atau \`!grafik 1w\`).
• \`!grafik [id_device] [periode]\` : Melihat grafik perangkat secara manual tanpa perlu melakukan !set terlebih dahulu.

🔹 *Konfigurasi Peringatan*
• \`!set-warning [opsi] [nilai]\` : Mengatur ambang batas (threshold) bahaya sensor pada perangkat via server.

⚠️ _Catatan: Untuk perintah sensor, status, grafik, dan set-warning, pastikan Anda sudah menautkan perangkat terlebih dahulu menggunakan perintah \`!set\``;
}

/**
 * Keyword for /help message
 *
 * @returns {string} 
 */
export const helpKeyword = () => {
  return `
    **PANDUAN PENGGUNAAN RUANGSENSE BOT**
    ━━━━━━━━━━━━━━━━━━
    Mengalami kendala atau ingin tahu lebih lanjut? Berikut panduan perintah lengkapnya:

    🌐 *Monitoring Perangkat:*
      - *!start* : Mengulang kembali pesan sambutan.
      - *!device [id_device] [action]* - Cek status koneksi perangkat ESP32.

    *📊 DATA SENSOR*
      - *!sensor-log [id_device]* - Mengambil data terbaru dari sensor Device.

    🚨 *Sistem Peringatan (Alert):*
    Bot ini akan otomatis mengirimkan pesan darurat jika sensor Device mendeteksi adanya asap atau gas yang melebihi ambang batas aman di ruangan Anda.

    Jika perangkat Anda *offline* atau data tidak dapat diperbarui, silakan periksa koneksi internet pada perangkat ESP32 Anda.
  `.trim().replace(/^[ \t]{4}/gm, '')
}