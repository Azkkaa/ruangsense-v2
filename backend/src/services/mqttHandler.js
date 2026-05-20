import mqtt from '../config/mqtt.js'
import { realtimeDeviceStatus } from '../controllers/DeviceController.js'
import { createSensorLogData } from '../controllers/sensorLogController.js'
import Device from '../models/Device.js'

export const startListening = (io) => {
  mqtt.on('message', async (topic, message) => {
    const msgStr = message.toString()
    const topicParts = topic.split('/')
    const deviceId = topicParts[2]

    if (topic.endsWith('/data')) {
      try {
        const parsedData = JSON.parse(msgStr)
        await createSensorLogData(deviceId, parsedData, io)
      } catch (err) {
        console.error("[MQTT] Error processing data:", err)
      }
    } else if (topic.endsWith('/status')) {
      try {
        const statusPayload = { deviceId, status: msgStr, }
        await realtimeDeviceStatus(statusPayload, io)
      } catch (err) {
        console.error("[MQTT] Error processing status:", err)
      }
    }
  })
}