import Device from '../models/Device.js'
import Sensor from '../models/SensorLog.js'
import SensorLog from '../models/SensorLog.js'

export const createSensorLogData = async (deviceId, data, io) => {
  try {
    let status = {}
    const { temp, humid, gas } = data

    // Determine Temperature status
    if (temp <= 22) status.temp_status = "cold"
    else if (temp < 33) status.temp_status = "normal"
    else if (temp < 40) status.temp_status = "hot"
    else status.temp_status = "very hot"

    // Determine Humid status
    if (humid <= 40) status.humid_status = "very dry"
    else if (humid < 65) status.humid_status = "dry"
    else if (humid < 85) status.humid_status = "normal"
    else status.humid_status = "humid"

    // Determine Gas status
    if (gas <= 10) status.gas_status = "normal"
    else if (gas < 25) status.gas_status = "warning"
    else if (gas < 40) status.gas_status ="danger"
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
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const timeString = `${day}/${month}/${year} ${hours}:${minutes}:${second}`

    const payload = {
      temp,
      temp_status: status.temp_status,
      humid,
      humid_status: status.humid_status,
      gas,
      gas_status: status.gas_status,
      time: timeString
    }

    io.to(deviceId).emit('device-data', payload);
    console.log(`[IoT Data] Broadcasted data to room ${deviceId}:`, payload)
    return true;
  } catch (err) {
    console.error("[SensorLogController] Error failed to process data:", err)
  }
}

export const createSensorLogDataHttp = async (req, res) => {
  try {
    let status = {}
    const { deviceId, temp, humid, gas } = req.body

    // Determine Temperature status
    if (temp <= 24) status.temp_status = "cool"
    else if (temp < 28) status.temp_status = "normal"
    else if (temp < 35) status.temp_status = "warm"
    else status.temp_status = "hot"

    // Determine Humid status
    if (humid <= 50 && humid > 0) status.humid_status = "dry"
    else if (humid < 70) status.humid_status = "normal"
    else if (humid < 85) status.humid_status = "humid"
    else if (humid > 85) status.humid_status = "very humid"
    else status.humid_status = "undefined"

    // Determine Gas status
    if (gas <= 10) status.gas_status = "normal"
    else if (gas < 25) status.gas_status = "warning"
    else if (gas > 25) status.gas_status ="danger"
    else status.gas_status = "undefined"

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

    return res.status(201).json({
      success: true,
      data: newData
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error!!',
      error: err.message
    })
  }
}

export const getTypeMonitoring = async (req, res) => {
  try {
    const { deviceId, command } = req.params;
    const typeMeaning = {
      'suhu': 'temp',
      'kelembapan': 'humid',
      'gas': 'gas'
    }

    const typeOriginal = typeMeaning[command]
    if (!typeOriginal) {
      return res.status(422).json({
        sucess: false,
        message: "Command must be field!",
        command
      })
    }

    let projection = {}
    projection[typeOriginal] = 1
    projection[`${typeOriginal}_status`] = 1

    const logData = await SensorLog.find(
      { device_id: deviceId },
      projection
    ).sort({created_at: -1}).limit(10)

    return res.status(200).json({
      success: true,
      logs: logData
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error!!',
      error: err.message
    })
  }
}

export const getSensorLogData = async (req, res) => {
  try {
    const { deviceId } = req.params

    const totalDays = parseInt(req.query.days, 10) || 1;
    const interval = req.query.interval || '1h'

    // Countdown Date ($gte)
    // Subtracts the current time by the total number of days the user requested.
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - totalDays);

    let groupFormat = {};

    if (interval === '1h') {
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hour: { $hour: '$createdAt' }
      }
    } else if (interval === '6h') {
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        hourBlock: {
          $subtract: [
            { $hour: '$createdAt' },
            { $mod: [{ $hour: '$createdAt' }, 6] }
          ]
        }
      };
    } else if (interval === '1d') {
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    }

    const aggregatedLogs = await SensorLog.aggregate([
      {
        $match: {
          device_id: deviceId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupFormat,
          avgTemp: { $avg: '$temp' },
          avgHumid: { $avg: '$humid' },
          avgGas: { $avg: '$gas' },
          sampleDate: { $first: '$createdAt' }
        }
      },
      {
        $sort: { sampleDate: 1 }
      },
      {
        $limit: 100
      }
    ]);

    res.status(200).json({
      success: true,
      message: `Berhasil mengagregasi data ${totalDays} hari terakhir dengan interval ${interval}`,
      totalData: aggregatedLogs.length,
      logs: aggregatedLogs
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error!!",
      error: err.message
    })
  }
}