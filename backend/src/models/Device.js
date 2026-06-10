import mongoose from 'mongoose'

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'device-name'
  },
  device_id: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: false,
    default: false
  },
  battery: {
    type: Number,
    required: false,
    min: 0,
    max: 100,
    default: 100
  },
  charge_status: {
    type: Boolean,
    required: false,
    default: false
  },
  last_seen: {
    type: Date,
    default: Date.now
  }
})

const Device = mongoose.model('Device', deviceSchema)

export default Device