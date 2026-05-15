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