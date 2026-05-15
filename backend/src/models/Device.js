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
  last_seen: {
    type: Date,
    default: Date.now
  }
})

const Device = mongoose.model('Device', deviceSchema)

export default Device