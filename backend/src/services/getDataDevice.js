import api from '../utils/api.js';
import { emojiStatusCondition, formatDateTime } from '../utils/helper.js';

/**
 * Getting Device Status
 *
 * @async
 * @param {string} deviceId 
 * @returns {string} 
 */
export const getDeviceStatus = async (deviceId) => {
  try {
    console.log(deviceId)
    const res = await api.get(`/api/device/${deviceId}/status`);

    const logs = res.data.logs;
    const isOnline = res.data.isOnline;

    // 1. Validation if logs empty
    if (!logs || logs.length === 0) {
      return `🔌 *Status Device:* ${isOnline ? '🟢 Online' : '🔴 Offline'}\n\n📊 *Data Sensor:* Data log masih kosong. Tunggu beberapa saat atau periksakan device anda.`;
    }

    // 2. Counting on sensor value
    let tempValue = 0;
    let humidValue = 0;
    let gasValue = 0;

    logs.forEach(log => {
      tempValue += log.temp || 0;
      humidValue += log.humid || 0;
      gasValue += log.gas || 0;
    });

    const dataAmount = logs.length;
    const tempAverage = (tempValue / dataAmount).toFixed(1);
    const humidAverage = (humidValue / dataAmount).toFixed(1);
    const gasAverage = (gasValue / dataAmount).toFixed(1);

    // 4. Susun teks laporan untuk WhatsApp
    const status = isOnline === 'Online' || isOnline === true ? '🟢 Online' : '🔴 Offline';

    const messageResponse = `
*📱 STATUS DEVICE*
━━━━━━━━━━━━━━━━━━

🔌 *Status:* ${status}${!isOnline ? `\n🕧 *Aktivitas Terakhir:* ${formatDateTime(res.data.last_seen)}` : ''}
🧾 Diambil dari *${dataAmount}* log data terakhir

*Rata-rata Kondisi Ruangan:*
🌡️ Suhu: ${tempAverage} °C
💧 Kelembapan: ${humidAverage} %
💨 Indeks Asap/Gas: ${gasAverage} PPM

_(Data ini dihitung berdasarkan rata-rata 10 riwayat sensor terbaru)_
    `.trim();

    return messageResponse;

  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    return "❌ Gagal memuat operasi. Silakan coba beberapa saat lagi.";
  }
}

export const handleMonitoring = async (command, deviceId) => {
  try {
    const res = await api.get(`/api/sensor-log/${deviceId}/${command}`)

    const logs = res.data.logs

    if (!logs || logs.length === 0) {
      return "📊 *Data Sensor:* Data log masih kosong. Tunggu beberapa saat atau periksakan device anda."
    }

    const typeMeaning = {
      'suhu': 'temp',
      'kelembapan': 'humid',
      'gas': 'gas'
    };

    const dataAmount = logs.length
    const total = logs.reduce((sum, log) => sum + (log[typeMeaning[command]] || 0), 0);
    const average = (total / dataAmount).toFixed(2);

    let emoji = '';
    let unit = '';
    if (command === 'suhu') { emoji = '🌡️'; unit = '°C'; }
    if (command === 'kelembapan') { emoji = '💧'; unit = '%'; }
    if (command === 'gas') { emoji = '💨'; unit = ' PPM'; }

    const status = logs[0][`${typeMeaning[command]}_status`]
    const emojiStatus = emojiStatusCondition(typeMeaning[command], status);

    return `
${emoji} *Monitoring ${command.toUpperCase()}* ${emoji}
━━━━━━━━━━━━━━━━━━
🧾 Diambil dari *${dataAmount}* log data ${command} terakhir

*📌 Kondisi Terakhir (Terbaru):*
✅ Nilai Terakhir: ${logs[0][typeMeaning[command]]} ${unit}
${emojiStatus} Status : *${status.toUpperCase()}*

📈 *Analisis Rata-Rata:* *${average}${unit}*
    `.trim()
  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    return "❌ Gagal mengambil data sensor dari server. Silakan coba beberapa saat lagi."
  }
}
