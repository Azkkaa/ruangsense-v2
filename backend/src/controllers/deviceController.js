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
    let deviceStatus;
    if (statusPayload.status === 'online') deviceStatus = true
    if (statusPayload.status === 'offline') deviceStatus = false
    await Device.findOneAndUpdate({device_id: statusPayload.deviceId}, {status: deviceStatus})

    io.to(statusPayload.deviceId).emit('v2-device-status', statusPayload)

    console.log(`[DeviceController] Broadcasted status to room ${statusPayload.deviceId}:`, statusPayload)
  } catch (err) {
    console.error("[DeviceController] Failed to broadcasted status:", err)
  }
}

export const updateDeviceBattery = async (deviceId, battery, io) => {
  try {
    const updatedDevice = await Device.findOneAndUpdate(
      { device_id: deviceId },
      { battery },
      { new: true }
    );
    if (updatedDevice) {
      io.to(deviceId).emit('v2-device-update', { battery });
      console.log(`[DeviceController] Updated and broadcasted battery for room ${deviceId}:`, battery);
    }
  } catch (err) {
    console.error("[DeviceController] Failed to update device battery:", err);
  }
}

export const updateDeviceChargeStatus = async (deviceId, chargeStatus, io) => {
  try {
    const updatedDevice = await Device.findOneAndUpdate(
      { device_id: deviceId },
      { charge_status: chargeStatus },
      { new: true }
    );
    if (updatedDevice) {
      io.to(deviceId).emit('v2-device-update', { charge_status: chargeStatus });
      console.log(`[DeviceController] Updated and broadcasted charge_status for room ${deviceId}:`, chargeStatus);
    }
  } catch (err) {
    console.error("[DeviceController] Failed to update device charge_status:", err);
  }
}