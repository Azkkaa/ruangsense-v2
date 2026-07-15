import { sendSensorAlertWhatsApp } from '../bot.js'
import mqtt from '../config/mqtt.js'
import { updateDeviceStatus } from '../controllers/deviceController.js'
import { createSensorLogData } from '../controllers/sensorLogController.js'
import Device from '../models/Device.js'
import { emojiStatusCondition } from '../utils/helper.js'

const lastNotificationSent = {};

export const startListening = (io) => {
  mqtt.on('message', async (topic, message) => {
    const msgStr = message.toString()
    const topicParts = topic.split('/')
    const deviceId = topicParts[2]

    // This is for receive new data from device/sensor
    if (topic.endsWith('/sensor_data')) {
      try {
        const parsedData = JSON.parse(msgStr)
        await createSensorLogData(deviceId, parsedData, io)

        const temp = parsedData.temp;
        const gas = parsedData.gas;

        const deviceThreshold = await Device.findOne({ device_id: deviceId }, { threshold_gas: 1, threshold_temp: 1, _id: 0})
        const isTempDanger = temp >= deviceThreshold.threshold_temp;
        const isGasDanger = gas >= deviceThreshold.threshold_gas;

        let status = {}
        // Determine Temperature status
        if (temp <= 22) status.temp_status = "cold"
        else if (temp < 33) status.temp_status = "normal"
        else if (temp < 40) status.temp_status = "hot"
        else status.temp_status = "very hot"

        // Determine Gas status
        if (gas <= 10) status.gas_status = "normal"
        else if (gas < 25) status.gas_status = "warning"
        else if (gas < 40) status.gas_status ="danger"
        else status.gas_status = "critical"

        let alertPayload;
        const lastNotificationSent = {};
        if (isTempDanger || isGasDanger) {
          const now = Date.now();
          const lastSent = lastNotificationSent[deviceId] || 0;
          const fiveMinutes = 5 * 60 * 1000;

          if (now - lastSent >= fiveMinutes) {
            const timeString = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }); 
            
            const alertPayload = {
              device_id: deviceId,
              time: timeString,
              isTempDanger: isTempDanger,
              isGasDanger: isGasDanger,
              temp_value: temp,
              temp_status: emojiStatusCondition('temp', status.temp_status), 
              gas_value: gas,
              gas_status: status.gas_status
            };

            await sendSensorAlertWhatsApp(alertPayload);

            lastNotificationSent[deviceId] = now;
            console.log(`[ALERT] WhatsApp notification sent for device ${deviceId}.`);
          } else {
            const remainingTime = Math.ceil((fiveMinutes - (now - lastSent)) / 1000);
            console.log(`[ALERT SKIPPED] Device ${deviceId} is in danger, but notification is rate-limited. Wait another ${remainingTime}s.`);
          }
        }
      } catch (err) {
        console.error("[MQTT] Error processing sensor_data:", err)
      }
    }

    // This is for updating "offline" or "online" status on device
    else if (topic.endsWith('/status')) {
      try {
        const statusPayload = { deviceId, status: msgStr }
        await updateDeviceStatus(statusPayload, io)
      } catch (err) {
        console.error("[MQTT] Error processing status:", err)
      }
    }
  })
}