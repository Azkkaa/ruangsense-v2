import express from 'express'
import { getDeviceSensorLogData, createSensorLogData } from '../controllers/sensorLogController.js'

const router = express.Router()

router.post('/create', createSensorLogData)
router.get('/:deviceId', getDeviceSensorLogData)

export default router;