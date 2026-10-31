import UserDevice from "../models/UserDevice.js";
import { extractPhoneNumber } from '../utils/helper.js';

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

    const targetChatId = String(whatsappChatId || '').trim();
    const targetNumber = String(whatsappNumber || '').trim();
    const targetDeviceId = String(deviceId || '').trim();

    const invalidValues = ['[object Object]', 'undefined', 'null', ''];

    if (
      invalidValues.includes(targetChatId) ||
      invalidValues.includes(targetNumber) ||
      invalidValues.includes(targetDeviceId)
    ) {
      return {
        success: false,
        message: '❌ Format input tidak valid!'
      };
    }

    // 1. Clear targetDeviceId from any previous owner in in-memory cache
    for (const [chatId, devId] of Object.entries(deviceCache)) {
      if (devId === targetDeviceId) {
        delete deviceCache[chatId];
      }
    }

    // 2. If this user had a different device previously, delete that old pairing
    await UserDevice.deleteMany({
      whatsapp_chat_id: targetChatId,
      device_id: { $ne: targetDeviceId }
    });

    // 3. Find and update by device_id so ownership transfers to the new phone number
    await UserDevice.findOneAndUpdate(
      { device_id: targetDeviceId },
      {
        device_id: targetDeviceId,
        whatsapp_chat_id: targetChatId,
        whatsapp_number: targetNumber
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    // 4. Set the new owner in memory cache
    deviceCache[targetChatId] = targetDeviceId;

    return {
      success: true,
      message: `✅ Berhasil menautkan device *${targetDeviceId}* ke nomor WhatsApp kamu!`
    };
  } catch (err) {
    console.error("[SetUserDeviceId Refactor Error]:", err.message);

    return {
      success: false,
      message: '❌ Gagal menyimpan konfigurasi pairing ke database.'
    };
  }
};

const loadDeviceCache = async () => {
  try {
    const pairings = await UserDevice.find({}, { whatsapp_number: 1, whatsapp_chat_id: 1, device_id: 1, _id: 0 });

    pairings.forEach((item) => {
      deviceCache[item.whatsapp_chat_id] = item.device_id;
    });
    console.log(`✅ Cache berhasil dimuat: ${pairings.length} device terdaftar.`);
  } catch (err) {
    console.error("[LoadDeviceCache Refactor Error]:", err.message);
  }
};

export default loadDeviceCache;
