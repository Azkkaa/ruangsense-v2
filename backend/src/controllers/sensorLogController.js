import Device from '../models/Device.js'
import SensorLog from '../models/SensorLog.js'

export const createSensorLogData = async (deviceId, data, io) => {
  try {
    let status = {}
    const { temp, humid, gas } = data

    // Determine Temperature status
    if (temp <= 22) status.temp_status = "cold"
    else if (temp < 32) status.temp_status = "normal"
    else if (temp < 40) status.temp_status = "hot"
    else status.temp_status = "very hot"

    // Determine Humid status
    if (humid <= 40) status.humid_status = "very dry"
    else if (humid < 65) status.humid_status = "dry"
    else if (humid < 85) status.humid_status = "normal"
    else status.humid_status = "humid"

    // Determine Gas status
    if (gas <= 70) status.gas_status = "normal"
    else if (gas < 150) status.gas_status = "warning"
    else if (gas < 400) status.gas_status ="danger"
    else status.gas_status = "critical"

    const newData = await SensorLog.create({
      device_id: deviceId,
      temp,
      temp_status: status.temp_status,
      humid,
      humid_status: status.humid_status,
      gas,
      gas_status: status.gas_status
    })

    const date = new Date(newData.updatedAt)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    const payload = {
      temp,
      temp_status: status.temp_status,
      humid,
      humid_status: status.humid_status,
      gas,
      gas_status: status.gas_status,
      time: `${hours}:${minutes}:${second}`
    }

    io.to(deviceId).emit('v2-device-data', payload);
    console.log(`[IoT Data] Broadcasted data to room ${deviceId}:`, payload)

    return true;
  } catch (err) {
    console.error("[SensorLogController] Error failed to process data:", err)
  }
}

/** 
 * this method is for get the last 10 data
 * with purpose of creating first 10 data graphs
 */
export const getDeviceSensorLogData = async (req, res) => {
  try {
    const deviceId = req.params.deviceId

    const logData = await SensorLog.find({ device_id: deviceId }).sort({createdAt: -1}).limit(10)
    const deviceStatus = await Device.findOne({ device_id: deviceId })

    res.status(200).json({
      success: true,
      logs: logData,
      isOnline: deviceStatus.status
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}