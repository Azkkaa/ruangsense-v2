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

export const getSensorLogData = async (req, res) => {
  try {
    const data = await SensorLog.find().sort({createdAt: -1}).limit(20)
    res.status(200).json({
      success: true,
      count: data.length,
      data
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
}