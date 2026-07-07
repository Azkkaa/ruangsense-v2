import Device from '../models/Device.js';
import SensorLog from '../models/SensorLog.js';
import UserDevice from '../models/UserDevice.js';
import { formatAndMaskResponse } from '../utils/helper.js'

// ----- HTTP Controller Method ------
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
      message: 'Internal Server Error!!',
      error: err.message
    })
  }
}

export const getDeviceStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const device = await Device.findOne({ device_id: deviceId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device tidak ditemukan!'
      });
    }

    const [logs, userDevice] = await Promise.all([
      SensorLog.find({ device_id: deviceId })
        .sort({ createdAt: -1 })
        .limit(10),
      UserDevice.findOne({ device_id: deviceId }).select('whatsapp_number')
    ]);

    return res.status(200).json({
      success: true,
      device,
      logs,
      devicePhone: formatAndMaskResponse(userDevice?.whatsapp_number) || null,
      isOnline: device.status,
      last_seen: device.status ? null : device.last_seen
    });
  } catch (err) {
    console.log("[getDeviceStatus] ", err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error!!',
    });
  }
};

export const getDeviceId = async (req, res) => {
  try {
    const { deviceId } = req.params

    const device = await Device.findOne({ device_id: deviceId })
    if (!device) return res.status(404).json({
      success: false,
      message: `Device with id ${deviceId} was not found!!`
    })

    res.status(200).json({
      success: true,
      message: "Getting device data",
      device
    })
  } catch (err) {
    console.log("[getDeviceId] ", err)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error!!'
    })
  }
}

export const updateDeviceConfigHTTP = async (req, res, mqttClient) => {
  try {
    const { deviceId, THRESHOLD_TEMP, THRESHOLD_GAS, BUZZER_ALARM_ON } = req.body;

    if (!deviceId) {
      return res.status(400).json({ success: false, message: "Device ID must be field!!" });
    }

    const updateData = {};
    if (THRESHOLD_TEMP !== undefined) updateData.threshold_temp = THRESHOLD_TEMP;
    if (THRESHOLD_GAS !== undefined) updateData.threshold_gas = THRESHOLD_GAS;
    if (BUZZER_ALARM_ON !== undefined) updateData.buzzer_alarm_on = BUZZER_ALARM_ON;

    const updatedDevice = await Device.findOneAndUpdate(
      { device_id: deviceId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedDevice) {
      return res.status(404).json({ success: false, message: "Device not found!!" });
    }

    const mqttPayload = {};
    if (THRESHOLD_TEMP !== undefined) mqttPayload.THRESHOLD_TEMP = THRESHOLD_TEMP;
    if (THRESHOLD_GAS !== undefined) mqttPayload.THRESHOLD_GAS = THRESHOLD_GAS;
    if (BUZZER_ALARM_ON !== undefined) mqttPayload.BUZZER_ALARM_ON = BUZZER_ALARM_ON;

    const topic = `ruangsense-v2/device/${deviceId}/command`;

    mqttClient.publish(topic, JSON.stringify(mqttPayload), { qos: 1 });

    return res.status(200).json({
      success: true,
      message: "Successfully saving configure to database and device!",
      data: updatedDevice
    });

  } catch (error) {
    console.error("[updateDeviceConfigHTTP] ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!!"
    });
  }
};
// ----- End HTPP Controller Method -----

// ----- MQTT Controller Method -----
export const updateDeviceStatus = async (statusPayload, io) => {
  try {
    const updatedData = { status: statusPayload.status === 'online' }

    if (statusPayload.status === 'offline') updatedData.last_seen = Date.now()

    await Device.findOneAndUpdate(
      { device_id: statusPayload.deviceId },
      updatedData
    )

    io.to(statusPayload.deviceId).emit('device-status', statusPayload)

    console.log(`[DeviceController] Broadcasted status to room ${statusPayload.deviceId}:`, statusPayload)
  } catch (err) {
    console.error("[DeviceController] Failed to broadcasted status:", err)
  }
}
// ----- End MQTT Controller Method -----

// ----- Socket.io Controller Method -----
export const updateDeviceConfigSocket = async (data, mqttClient) => {
  try {
    const { deviceId, THRESHOLD_TEMP, THRESHOLD_GAS, BUZZER_ALARM_ON } = data;

    const updateData = {};
    if (THRESHOLD_TEMP !== undefined) updateData.threshold_temp = THRESHOLD_TEMP;
    if (THRESHOLD_GAS !== undefined) updateData.threshold_gas = THRESHOLD_GAS;
    if (BUZZER_ALARM_ON !== undefined) updateData.buzzer_alarm_on = BUZZER_ALARM_ON;

    await Device.findOneAndUpdate({ device_id: deviceId }, { $set: updateData });

    const mqttPayload = {};
    if (THRESHOLD_TEMP !== undefined) mqttPayload.THRESHOLD_TEMP = THRESHOLD_TEMP;
    if (THRESHOLD_GAS !== undefined) mqttPayload.THRESHOLD_GAS = THRESHOLD_GAS;
    if (BUZZER_ALARM_ON !== undefined) mqttPayload.BUZZER_ALARM_ON = BUZZER_ALARM_ON;

    const topic = `ruangsense-v2/device/${deviceId}/command`;
    mqttClient.publish(topic, JSON.stringify(mqttPayload), { qos: 1 });
    console.log(`[Socket->Database->MQTT] Sukses sinkronisasi untuk device: ${deviceId}`);

  } catch (error) {
    console.error("Gagal memproses update config via Socket:", error);
  }
};
// ----- End Socket.io Controller Method -----