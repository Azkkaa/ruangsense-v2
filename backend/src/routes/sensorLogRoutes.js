import express from 'express'
import { createSensorLogData, getSensorLogData } from '../controllers/sensorLogController.js'

const router = express.Router()

router.route('/')
  .get(getSensorLogData)
  .post(createSensorLogData)

export default router;