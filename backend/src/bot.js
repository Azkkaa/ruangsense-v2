import whatsappWeb from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { startKeyword, helpKeyword } from './services/startService.js';
import { getDeviceStatus, handleMonitoring } from './services/getDataDevice.js';
import { handleCombineChart } from './services/createImageChart.js';
import loadDeviceCache, { deviceCache, setUserDeviceId } from './services/setDeviceId.js';
import { parsePeriod } from './utils/helper.js';
import { setThresholdDevice } from './services/setWarning.js';
import Device from './models/Device.js'

const { Client, LocalAuth } = whatsappWeb;
export const lastDeviceAlerts = new Map();

export const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    handleSIGINT: false,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']
  }
});

export const sendSensorAlertWhatsApp = async (alertData) => {
  const {
    device_id,
    isTempDanger,
    isGasDanger,
    temp_value,
    gas_value,
    temp_status,
    gas_status,
    time
  } = alertData;

  const whatsappChatId = Object.keys(deviceCache).find(
    (chatId) => deviceCache[chatId] === device_id
  );

  if (!whatsappChatId) {
    console.log(`[Alert] Tidak ditemukan chat ID untuk device ${device_id}`);
    return;
  }

  const now = Date.now();
  const alertBefore = lastDeviceAlerts.get(device_id);
  const isMoreFiveMin = alertBefore && now - alertBefore.timestamp >= 5 * 60 * 1000;

  if (!alertBefore || isMoreFiveMin) {
    let alertMessage = `🚨 *NOTIFIKASI PERINGATAN*\n\nWaktu Kejadian: *${time}*\nID Perangkat: *${device_id}*\n\n`;
    if (isTempDanger) alertMessage += `🌡️ Suhu Mencapai Threshold: *${temp_value}°C*\n`;
    if (isGasDanger) alertMessage += `💨 Sensor Gas Mencapai Threshold: *${gas_value} ppm*\n`;
    alertMessage += `\n_Mohon segera lakukan pengecekan fisik pada ruangan terkait!_`;

    try {
      await client.sendMessage(whatsappChatId, alertMessage);
      console.log(`[Notif Sent] Sukses mengirim peringatan ke chatid: ${whatsappChatId}`);
      lastDeviceAlerts.set(device_id, { temp_status, gas_status, timestamp: now });
    } catch (err) {
      console.error('❌ Gagal mengirim pesan alert via WhatsApp:', err.message);
    }
  }
};

export const initWhatsappBot = (io) => {
  // --- EVENT WHATSAPP CLIENT ---
  client.on('qr', (qr) => {
    console.log('--- SCAN QR CODE INI DENGAN WHATSAPP HP KAMU ---');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', async () => {
    console.log("WhatsApp Bot RuangSense Aktif!");
    await loadDeviceCache();
  });

  client.on('message', async (msg) => {
    const text = msg.body.trim();
    if (!text.startsWith('!')) return;

    const args = text.slice(1).split(/ +/);
    const command = args.shift().toLowerCase();
    const whatsappChatId = msg.from;
    const deviceId = deviceCache[whatsappChatId];

    switch (command) {
      case 'set': {
        const inputDeviceId = args[0];
        if (!inputDeviceId) {
          await msg.reply('❌ Format salah! Gunakan: `!set [id_device]`');
          break;
        }
        const result = await setUserDeviceId(client, whatsappChatId, inputDeviceId);
        await msg.reply(result.message);
        break;
      }
      case 'start':
        await msg.reply(startKeyword());
        break;
      case 'help':
        await msg.reply(helpKeyword());
        break;
      case 'suhu':
      case 'kelembapan':
      case 'gas':
        if (!deviceId) {
          await msg.reply(`⚠️ Perangkat belum ditautkan. Ketik \`!set [id_device]\``);
          break;
        }
        await msg.reply(await handleMonitoring(command, deviceId));
        break;
      case 'status':
        if (!deviceId) {
          await msg.reply(`⚠️ Perangkat belum ditautkan. Ketik \`!set [id_device]\``);
          break;
        }
        await msg.reply(await getDeviceStatus(deviceId));
        break;
      case 'grafik': {
        let targetDeviceId = args[0] ? args[0] : deviceCache[whatsappChatId];
        let periodInput = args[1] ? args[1] : undefined;
        
        if (args[0] && /^\d+[dwm]$/i.test(args[0])) {
          targetDeviceId = deviceCache[whatsappChatId];
          periodInput = args[0];
        }

        if (!targetDeviceId) {
          await msg.reply(`⚠️ Perangkat belum ditautkan atau format salah.`);
          break;
        }

        const period = parsePeriod(periodInput);
        if (!period.isValid) {
          await msg.reply(period.message);
          break;
        }

        const loadingGrafikMsg = await msg.reply("⏳ Sedang merender grafik, mohon tunggu...");
        const result = await handleCombineChart(targetDeviceId, period.totalDays, period.interval);

        if (typeof result === 'string') {
          await msg.reply(result);
        } else {
          await client.sendMessage(whatsappChatId, result.media, { caption: result.caption });
        }

        try { await loadingGrafikMsg.delete(true); } catch (err) { console.error(err.message); }
        break;
      }
      case 'set-warning':
        if (!deviceId) {
          await msg.reply('⚠️ Perangkat belum ditautkan...');
          break;
        }
        const choice = args[0] ? args[0].toLocaleLowerCase() : null;
        const valueInput = args[1];
        const result = setThresholdDevice(deviceId, choice, valueInput);
        
        if (result.success) {
          io.emit('update-device-config', result.payload);

          io.to(deviceId).emit('update-device-config', result.payload);
          
          await msg.reply(result.message + ` pada device *${deviceId}* via Server.`);
        }
        break;
      default:
        await msg.reply('⚠️ Perintah tidak dikenali. Ketik !help untuk bantuan.');
        break;
    }
  });

  client.initialize();
};