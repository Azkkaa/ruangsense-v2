import Device from '../models/Device.js';
import SensorLog from '../models/SensorLog.js';
import UserDevice from '../models/UserDevice.js';
import { emojiStatusCondition, formatDateTime, formatAndMaskResponse } from '../utils/helper.js';

/**
 * Getting Device Status Directly from DB
 *
 * @async
 * @param {string} deviceId 
 * @returns {string} 
 */
export const getDeviceStatus = async (deviceId) => {
  try {
    console.log("Fetching status from DB for device:", deviceId);

    const device = await Device.findOne({ device_id: deviceId });

    if (!device) {
      return `❌ Device dengan ID *${deviceId}* tidak ditemukan!`;
    }

    const [logs, userDevice] = await Promise.all([
      SensorLog.find({ device_id: deviceId })
        .sort({ createdAt: -1 })
        .limit(10),
      UserDevice.findOne({ device_id: deviceId }).select('whatsapp_number')
    ]);

    const isOnline = device.status;
    const lastSeenData = device.status ? null : device.last_seen;

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
    const status = isOnline ? '🟢 Online' : '🔴 Offline';

    const messageResponse = `
*📱 STATUS DEVICE*
━━━━━━━━━━━━━━━━━━

🔌 *Status:* ${status}${!isOnline && lastSeenData ? `\n🕧 *Aktivitas Terakhir:* ${formatDateTime(lastSeenData)}` : ''}
🧾 Diambil dari *${dataAmount}* log data terakhir

*Rata-rata Kondisi Ruangan:*
🌡️ Suhu: ${tempAverage} °C
💧 Kelembapan: ${humidAverage} %
💨 Indeks Asap/Gas: ${gasAverage} PPM

_(Data ini dihitung berdasarkan rata-rata 10 riwayat sensor terbaru)_
    `.trim();

    return messageResponse;

  } catch (err) {
    console.error("[getDeviceStatus Refactor Error]:", err.message);
    return "❌ Gagal memuat status device dari database. Silakan coba beberapa saat lagi.";
  }
}

export const handleMonitoring = async (command, deviceId) => {
  try {
    const typeMeaning = {
      'suhu': 'temp',
      'kelembapan': 'humid',
      'gas': 'gas'
    };

    const typeOriginal = typeMeaning[command];
    if (!typeOriginal) {
      return "❌ Perintah tidak valid!";
    }

    let projection = {};
    projection[typeOriginal] = 1;
    projection[`${typeOriginal}_status`] = 1;
    projection['createdAt'] = 1;

    const logs = await SensorLog.find(
      { device_id: deviceId },
      projection
    ).sort({ createdAt: -1 }).limit(20);

    if (!logs || logs.length === 0) {
      return "📊 *Data Sensor:* Data log masih kosong. Tunggu beberapa saat atau periksakan device anda.";
    }

    const dataAmount = logs.length;
    const total = logs.reduce((sum, log) => sum + (log[typeOriginal] || 0), 0);
    const average = (total / dataAmount).toFixed(2);

    let emoji = '';
    let unit = '';
    if (command === 'suhu') { emoji = '🌡️'; unit = '°C'; }
    if (command === 'kelembapan') { emoji = '💧'; unit = '%'; }
    if (command === 'gas') { emoji = '💨'; unit = ' PPM'; }

    const status = logs[0][`${typeOriginal}_status`] || 'undefined';
    const emojiStatus = emojiStatusCondition(typeOriginal, status);

    const lastLogDate = new Date(logs[0].createdAt);
    const day = String(lastLogDate.getDate()).padStart(2, '0');
    const month = String(lastLogDate.getMonth() + 1).padStart(2, '0'); // Month berkisar 0-11
    const year = lastLogDate.getFullYear();
    const hours = String(lastLogDate.getHours()).padStart(2, '0');
    const minutes = String(lastLogDate.getMinutes()).padStart(2, '0');
    const seconds = String(lastLogDate.getSeconds()).padStart(2, '0');

    const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return `
${emoji} *Monitoring ${command.toUpperCase()}* ${emoji}
━━━━━━━━━━━━━━━━━━
🧾 Diambil dari *${dataAmount}* log data ${command} terakhir

*📌 Kondisi Terakhir (Terbaru):*
📅 Waktu         : ${formattedTime}
✅ Nilai Terakhir: ${logs[0][typeOriginal]} ${unit}
${emojiStatus} Status        : *${status.toUpperCase()}*

📈 *Analisis Rata-Rata:* *${average}${unit}*
    `.trim();
    
  } catch (err) {
    console.error("[handleMonitoring Refactor Error]:", err.message);
    return "❌ Gagal mengambil data sensor dari database. Silakan coba beberapa saat lagi.";
  }
}