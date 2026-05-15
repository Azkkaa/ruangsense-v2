import express from 'express'
import { createDevice } from '../controllers/DeviceController.js'

const router = express.Router()

router.route('/')
  .post(createDevice)

export default router;