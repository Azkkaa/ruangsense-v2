import api from "../utils/api.js";
import {extractPhoneNumber} from '../utils/helper.js'

export const deviceCache = {};

export const setUserDeviceId = async (client, whatsappChatId, deviceId) => {
  try {
    let finalChatId = whatsappChatId;

    if (whatsappChatId.includes('@lid')) {
      try {
        const contact = await client.getContactById(whatsappChatId);
        if (contact && contact.id._serialized) {
          finalChatId = contact.id._serialized; 
        }
      } catch (err) {
        console.warn("[SetUserDeviceId] Gagal mengonversi @lid ke @c.us, menggunakan ID asli.");
      }
    }

    const whatsappNumber = extractPhoneNumber(finalChatId);

    await api.post('api/user-devices/create', {
      device_id: deviceId,
      whatsapp_chat_id: whatsappChatId,
      whatsapp_number: whatsappNumber
    });

    deviceCache[whatsappChatId] = deviceId;

    return {
      success: true,
      message: `✅ Berhasil menautkan device *${deviceId}* ke nomor WhatsApp kamu!`
    }
  } catch (err) {
    console.error("[SetUserDeviceId] Status:", err.response?.status);
    console.error("[SetUserDeviceId] Data:", err.response?.data);
    console.error("[SetUserDeviceId] Message:", err.message);

    return {
      success: false,
      message: '❌ Gagal menyimpan konfigurasi ke server.'
    }
  }
};

const loadDeviceCache = async () => {
  try {
    const res = await api.get('api/user-devices')
    const pairings = res.data.pairings;

    pairings.forEach((item) => {
      deviceCache[item.whatsapp_chat_id] = item.device_id;
    });
    console.log(`✅ Cache berhasil dimuat: ${pairings.length} device terdaftar.`)
  } catch (err) {
    console.error("[LoadDeviceCache]Status:", err.response?.status);
    console.error("[LoadDeviceCache]Data:", err.response?.data);
    console.error("[LoadDeviceCache]Message:", err.message);
  }
}

export default loadDeviceCache;