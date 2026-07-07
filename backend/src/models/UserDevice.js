import mongoose from 'mongoose';

const userDeviceSchema = new mongoose.Schema(
  {
    device_id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    whatsapp_chat_id: {
      type: String,
      required: true,
      trim: true
    },
    whatsapp_number: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const UserDevice = mongoose.model('UserDevice', userDeviceSchema);
export default UserDevice;