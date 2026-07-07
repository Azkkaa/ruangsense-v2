import mongoose from 'mongoose'

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'device-name',
    trim: true
  },
  device_id: {
    type: String,
    required: [true, "Device ID must be field"],
    trim: true,
    unique: [true, "This Device ID is already exist"]
  },
  status: {
    type: Boolean,
    required: false,
    default: false
  },
  threshold_gas: {
    type: Number,
    default: 10
  },
  threshold_temp: {
    type: Number,
    default: 34
  },
  buzzer_alarm_on: {
    type: Boolean,
    default: true
  },
  last_seen: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

const Device = mongoose.model('Device', deviceSchema)

export default Device