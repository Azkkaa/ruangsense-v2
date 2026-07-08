import Device from '../models/Device.js';

/**
 * Preparing and executing the threshold/alert change directly to DB and MQTT.
 *
 * @async
 * @param {string} deviceId 
 * @param {'temp'|'suhu'|'gas'|'buzzer'} choice 
 * @param {string} valueInput 
 * @param {object} mqttClient // 2. Tambahkan parameter mqttClient agar bisa sinkron ke hardware IoT
 * @returns {Promise<{
 *  success: boolean,
 *  message: string,
 *  payload?: {
 *    deviceId: string,
 *    THRESHOLD_TEMP?: number,
 *    THRESHOLD_GAS?: number,
 *    BUZZER_ALARM_ON?: boolean
 *  }
 * }>} 
 */
export const setThresholdDevice = async (deviceId, choice, valueInput, mqttClient) => {
  if (!choice || !valueInput) return {
    success: false,
    message: '❌ *Format Salah!*\n\n' + 'Gunakan format berikut:\n' +
        '• `!set-warning temp [angka]` (Contoh: `!set-warning temp 35`)\n' +
        '• `!set-warning gas [angka]` (Contoh: `!set-warning gas 15`)\n' +
        '• `!set-warning buzzer [on/off]` (Contoh: `!set-warning buzzer off`)'
  };

  let payload = { deviceId };
  let updateData = {};
  let mqttPayload = {};

  // 1. WhatsApp User Input Validation
  if (choice === 'temp' || choice === 'suhu') {
    const tempValue = parseInt(valueInput);
    if (isNaN(tempValue)) {
      return { success: false, message: '❌ Nilai suhu harus berupa angka murni!' };
    }
    payload.THRESHOLD_TEMP = tempValue;
    updateData.threshold_temp = tempValue;
    mqttPayload.THRESHOLD_TEMP = tempValue;

  } else if (choice === 'gas') {
    const gasValue = parseInt(valueInput);
    if (isNaN(gasValue)) {
      return { success: false, message: '❌ Nilai gas harus berupa angka murni!' };
    }
    payload.THRESHOLD_GAS = gasValue;
    updateData.threshold_gas = gasValue;
    mqttPayload.THRESHOLD_GAS = gasValue;

  } else if (choice === 'buzzer') {
    const state = valueInput.toLowerCase();
    if (state !== 'on' && state !== 'off' && state !== 'true' && state !== 'false') {
      return { success: false, message: '❌ Nilai status buzzer hanya menerima pilihan: `on` atau `off`!' };
    }
    const isBuzzerOn = (state === 'on' || state === 'true');
    payload.BUZZER_ALARM_ON = isBuzzerOn;
    updateData.buzzer_alarm_on = isBuzzerOn;
    mqttPayload.BUZZER_ALARM_ON = isBuzzerOn;

  } else {
    return { success: false, message: '❌ Pilihan tidak valid! Gunakan opsi `temp`, `gas`, atau `buzzer`.' };
  }

  // 2. Direct Execution Against Mongoose Database & IoT Devices (Controller Logic Migration)
  try {
    const updatedDevice = await Device.findOneAndUpdate(
      { device_id: deviceId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedDevice) {
      return { success: false, message: `❌ Device dengan ID *${deviceId}* tidak ditemukan di database!` };
    }

    // Publish data directly to the physical IoT device via an MQTT broker if the client instance is available.
    if (mqttClient && typeof mqttClient.publish === 'function') {
      const topic = `ruangsense-v2/device/${deviceId}/command`;
      mqttClient.publish(topic, JSON.stringify(mqttPayload), { qos: 1 });
      console.log(`[WhatsApp -> DB -> MQTT] Berhasil sinkronisasi konfigurasi ke topik: ${topic}`);
    } else {
      console.warn("[setThresholdDevice] Warning: mqttClient tidak aktif atau tidak di-passing.");
    }

    // Use the info text format based on the initial setup.
    let targetConfigName = choice === 'gas' ? 'THRESHOLD_GAS' : (choice === 'buzzer' ? 'BUZZER_ALARM_ON' : 'THRESHOLD_TEMP');
    let targetDisplayValue = choice === 'gas' ? `${payload.THRESHOLD_GAS} ppm` : (choice === 'buzzer' ? (payload.BUZZER_ALARM_ON ? 'TRUE' : 'FALSE') : `${payload.THRESHOLD_TEMP}°C`);

    return {
      success: true,
      message: `✅ Berhasil menyimpan konfigurasi database dan mengirim perintah mengubah *${targetConfigName}* menjadi *${targetDisplayValue}*`,
      payload
    };

  } catch (err) {
    console.error("[setThresholdDevice Refactor Error]:", err.message);
    return { success: false, message: '❌ Terjadi kegagalan server internal saat memperbarui konfigurasi.' };
  }
};