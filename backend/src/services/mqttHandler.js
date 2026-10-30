import { sendSensorAlertWhatsApp } from '../bot.js'
import mqtt from '../config/mqtt.js'
import { updateDeviceStatus } from '../controllers/deviceController.js'
import { createSensorLogData } from '../controllers/sensorLogController.js'
import { getDeviceThresholdCached } from './deviceCacheService.js'

export const startListening = (io) => {
  mqtt.on('message', async (topic, message) => {
    const msgStr = message.toString()
    const topicParts = topic.split('/')
    const deviceId = topicParts[2]

    if (!deviceId) return

    // This is for receive new data from device/sensor
    if (topic.endsWith('/sensor_data')) {
      try {
        const parsedData = JSON.parse(msgStr)
        const resultData = await createSensorLogData(deviceId, parsedData, io)

        const temp = parsedData.temp;
        const gas = parsedData.gas;

        const { threshold_temp: thresholdTemp = 34, threshold_gas: thresholdGas = 10 } = (await getDeviceThresholdCached(deviceId)) || {};

        const isTempDanger = temp !== undefined && temp >= thresholdTemp;
        const isGasDanger = gas !== undefined && gas >= thresholdGas;

        if (isTempDanger || isGasDanger) {
          const timeString = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }); 
          
          const alertPayload = {
            device_id: deviceId,
            time: timeString,
            isTempDanger,
            isGasDanger,
            temp_value: temp,
            temp_status: resultData?.status?.temp_status || "normal", 
            gas_value: gas,
            gas_status: resultData?.status?.gas_status || "normal"
          };

          await sendSensorAlertWhatsApp(alertPayload);
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