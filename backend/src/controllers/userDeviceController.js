import UserDevice from '../models/UserDevice.js';

export const createWhatsappUserDevice = async (req, res) => {
  try {
    const whatsappChatId = String(req.body.whatsapp_chat_id || '').trim();
    const whatsappNumber = String(req.body.whatsapp_number || '').trim();
    const deviceId = String(req.body.device_id || '').trim();

    const invalidValues = ['[object Object]', 'undefined', 'null', ''];

    if (
      invalidValues.includes(whatsappChatId) ||
      invalidValues.includes(whatsappNumber) ||
      invalidValues.includes(deviceId)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input format!'
      });
    }

    const updatedPairing = await UserDevice.findOneAndUpdate(
      { whatsapp_chat_id: whatsappChatId },
      {
        whatsapp_chat_id: whatsappChatId,
        whatsapp_number: whatsappNumber,
        device_id: deviceId
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Device successfully paired!',
      data: updatedPairing
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error!!',
      error: err.message
    });
  }
};

export const getAllWhatsappUserDevices = async (req, res) => {
  try {
    const pairings = await UserDevice.find({}, { whatsapp_number: 1, whatsapp_chat_id: 1, device_id: 1, _id: 0 });

    return res.status(200).json({
      success: true,
      pairings: pairings
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};