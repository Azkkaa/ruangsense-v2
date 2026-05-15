import mongoose from 'mongoose'

const sensorSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: [true, 'Device ID must be filled!']
  },
  temp: {
    type: Number,
    required: [true, 'Required a Temperature data!'],
    min: [-20, 'Abnormal Temperature (to cold)!'],
    max: [100, 'Abnormal Temperature (to hot)!']
  },
  humid: {
    type: Number,
    required: [true, 'Required a Humidity data!'],
    min: [0, 'Abnormal Humidity (below or equal to 0)'],
    max: [100, 'Abnormal Humidity (above or equal to 100)']
  },
  gas: {
    type: Number,
    required: [true, 'Required a Gas data!'],
    min: [0, 'Abnormal Gas Level (below or equal to 0)']
  },
  temp_status: {
    type: String,
    required: true,
    enum: [
      'cold',
      'normal',
      'hot',
      'very hot'
    ]
  },
  humid_status: {
    type: String,
    required: true,
    enum: [
      'very dry',
      'moderately dry',
      'normal',
      'humid'
    ]
  },
  gas_status: {
    type: String,
    required: true,
    enum: [
      'normal',
      'warning',
      'danger',
      'critical'
    ]
  }
},
{
  timestamps: true
})

const Sensor = mongoose.model('SensorLog', sensorSchema)

export default Sensor;