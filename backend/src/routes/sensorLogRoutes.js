import express from 'express'
import { createSensorLogDataHttp, getSensorLogData, getTypeMonitoring } from '../controllers/sensorLogController.js'

const router = express.Router()

router.get('/:deviceId', getSensorLogData)
router.get('/:deviceId/:command', getTypeMonitoring)

// router.post('/create', createSensorLogDataHttp)

export default router;