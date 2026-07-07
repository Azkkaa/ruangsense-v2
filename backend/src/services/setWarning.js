
/**
 * Preparing the threshold/alert change payload for the device based on user selection.
 *
 * @async
 * @param {string} deviceId 
 * @param {'temp'|'suhu'|'gas'|'buzzer'} choice 
 * @param {string} valueInput 
 * @returns {{
 *  success: boolean,
 *  message: string,
 *  payload?: {
 *    deviceId: string,
 *    THRESHOLD_TEMP?: number,
 *    THRESHOLD_GAS?: number,
 *    BUZZER_ALARM_ON?: boolean
 *  }
 * }} 
 */
export const setThresholdDevice = (deviceId, choice, valueInput) => {
  if (!choice || !valueInput) return {
    success: false,
    message: '❌ *Format Salah!*\n\n' + 'Gunakan format berikut:\n' +
        '• `!set-warning temp [angka]` (Contoh: `!set-warning temp 35`)\n' +
        '• `!set-warning gas [angka]` (Contoh: `!set-warning gas 15`)\n' +
        '• `!set-warning buzzer [on/off]` (Contoh: `!set-warning buzzer off`)'
  }

  let payload = { deviceId };

  if (choice === 'temp' || choice === 'suhu') {
    const tempValue = parseInt(valueInput);
    if (isNaN(tempValue)) {
      return {
        success: false,
        message: '❌ Nilai suhu harus berupa angka murni!'
      }
    }

    payload.THRESHOLD_TEMP = tempValue;
    return {
      success: true,
      message: `✅ Berhasil mengirim perintah untuk mengubah *THRESHOLD_TEMP* menjadi *${tempValue}°C*`,
      payload
    }
  } else if (choice === 'gas') {
    const gasValue = parseInt(valueInput);
    if (isNaN(gasValue)) {
      return {
        success: false,
        message: '❌ Nilai gas harus berupa angka murni!',
      }
    }

    payload.THRESHOLD_GAS = gasValue;
    return {
      success: true,
      message: `✅ Berhasil mengirim perintah untuk mengubah *THRESHOLD_GAS* menjadi *${gasValue} ppm*`,
      payload
    }
  } else if (choice === 'buzzer') {
    const state = valueInput.toLowerCase();
    if (state !== 'on' && state !== 'off' && state !== 'true' && state !== 'false') {
      return {
        success: false,
        message: '❌ Nilai status buzzer hanya menerima pilihan: `on` atau `off`!'
      }
    }

    const isBuzzerOn = (state === 'on' || state === 'true');
    payload.BUZZER_ALARM_ON = isBuzzerOn;
    return {
      success: true,
      message: `✅ Berhasil mengirim perintah untuk mengubah *BUZZER_ALARM_ON* menjadi *${isBuzzerOn ? 'TRUE' : 'FALSE'}*`,
      payload
    }
  } else {
    return {
      success: false,
      message: '❌ Pilihan tidak valid! Gunakan opsi `temp`, `gas`, atau `buzzer`.'
    }
  }
}