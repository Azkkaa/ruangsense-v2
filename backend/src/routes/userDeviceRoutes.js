import express from 'express';
import { createWhatsappUserDevice, getAllWhatsappUserDevices } from '../controllers/userDeviceController.js';

const router = express.Router()

router.get('/', getAllWhatsappUserDevices)

router.post('/create', createWhatsappUserDevice)

export default router;