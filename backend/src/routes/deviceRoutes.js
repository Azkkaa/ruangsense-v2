import express from 'express'
import { createDevice, getDeviceUser } from '../controllers/deviceController.js'

const router = express.Router()

router.post('/create', createDevice)
router.get('/:deviceId', getDeviceUser)

export default router;