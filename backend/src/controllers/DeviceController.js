import Device from '../models/Device.js'

export const createDevice = async (req, res) => {
  try {
    const {
      name,
      device_id,
    } = req.body

    const newData = await Device.create({
      name,
      device_id
    })

    res.status(201).json({
      success: true,
      data: newData
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export const getDeviceUser = async (req, res) => {
  try {
    const deviceId = req.params.deviceId

    const device = await Device.findOne({ device_id: deviceId })

    res.status(200).json({
      success: true,
      device: device
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

export const realtimeDeviceStatus = async (statusPayload, io) => {
  try {
    io.to(statusPayload.deviceId).emit('v2-device-status', statusPayload)

    console.log(`[DeviceController] Broadcasted status to room ${statusPayload.deviceId}:`, statusPayload)
  } catch (err) {
    console.error("[DeviceController] Failed to broadcasted status:", err)
  }
}