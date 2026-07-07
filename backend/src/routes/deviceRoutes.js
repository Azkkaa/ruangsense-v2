import express from 'express'
import {
  createDevice,
  getDeviceId,
  getDeviceStatus,
  updateDeviceConfigHTTP
} from '../controllers/deviceController.js'

const router = express.Router()

router.get('/:deviceId', getDeviceId)
router.get('/:deviceId/status', getDeviceStatus)

router.post('/create', createDevice)

router.patch('/update-config', updateDeviceConfigHTTP)

export default router;