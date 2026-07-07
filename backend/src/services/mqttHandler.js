import { sendSensorAlertWhatsApp } from '../bot.js'
import mqtt from '../config/mqtt.js'
import { updateDeviceStatus } from '../controllers/deviceController.js'
import { createSensorLogData } from '../controllers/sensorLogController.js'
import Device from '../models/Device.js'

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

        const deviceThreshold = await Device.findOne({ device_id: deviceId }, { threshold_gas: 1, threshold_temp: 1, _id: 0})
        const isTempDanger = parsedData.temp >= deviceThreshold.threshold_temp;
        const isGasDanger = parsedData.gas >= deviceThreshold.threshold_gas;

        let alertPayload;
        if (isTempDanger || isGasDanger) { 
          alertPayload = {
            device_id: deviceId,
            time: timeString,
            isTempDanger: isTempDanger,
            isGasDanger: isGasDanger,
            temp_value: temp,
            temp_status: status.temp_status,
            gas_value: gas,
            gas_status: status.gas_status
          };

          await sendSensorAlertWhatsApp(alertPayload)
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