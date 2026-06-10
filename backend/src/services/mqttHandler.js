import mqtt from '../config/mqtt.js'
import { 
  realtimeDeviceStatus, 
  updateDeviceBattery, 
  updateDeviceChargeStatus 
} from '../controllers/deviceController.js'
import { createSensorLogData } from '../controllers/sensorLogController.js'
import Device from '../models/Device.js'

export const startListening = (io) => {
  mqtt.on('message', async (topic, message) => {
    const msgStr = message.toString()
    const topicParts = topic.split('/')
    const deviceId = topicParts[2]

    if (topic.endsWith('/sensor_data')) {
      try {
        const parsedData = JSON.parse(msgStr)
        await createSensorLogData(deviceId, parsedData, io)
      } catch (err) {
        console.error("[MQTT] Error processing sensor_data:", err)
      }
    } else if (topic.endsWith('/status')) {
      try {
        const statusPayload = { deviceId, status: msgStr }
        await realtimeDeviceStatus(statusPayload, io)
      } catch (err) {
        console.error("[MQTT] Error processing status:", err)
      }
    } else if (topic.endsWith('/charge_status')) {
      try {
        const chargeStatus = msgStr === 'true'
        await updateDeviceChargeStatus(deviceId, chargeStatus, io)
      } catch (err) {
        console.error("[MQTT] Error processing charge_status:", err)
      }
    } else if (topic.endsWith('/battery_percent')) {
      try {
        const batteryVal = parseFloat(msgStr)
        if (!isNaN(batteryVal)) {
          await updateDeviceBattery(deviceId, batteryVal, io)
        }
      } catch (err) {
        console.error("[MQTT] Error processing battery_percent:", err)
      }
    }
  })
}