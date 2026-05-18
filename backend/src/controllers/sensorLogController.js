import Device from '../models/Device.js'
import SensorLog from '../models/SensorLog.js'

export const createSensorLogData = async (req, res) => {
  try {
    const {
      device_id,
      temp,
      temp_status,
      humid,
      humid_status,
      gas,
      gas_status
    } = req.body

    const newData = await SensorLog.create({
      device_id,
      temp,
      temp_status,
      humid,
      humid_status,
      gas,
      gas_status
    })

    const io = res.app.get('io')

    const date = new Date(newData.updatedAt)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    const payload = {
      temp: newData.temp,
      temp_status: newData.temp_status,
      humid: newData.humid,
      humid_status: humid_status,
      gas: newData.gas,
      gas_status: newData.gas_status,
      time: `${hours}:${minutes}:${second}`
    }

    io.to(device_id).emit('v2-device-data', payload);
    console.log(`[IoT Data] Broadcasted to room ${device_id}:`)

    res.status(201).json({
      success: true,
      data: payload
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
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

    res.status(200).json({
      success: true,
      logs: logData
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}