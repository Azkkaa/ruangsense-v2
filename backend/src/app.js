import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import sensorLogRoutes from './routes/sensorLogRoutes.js'
import deviceRoutes from './routes/deviceRoutes.js'

const app = express()

const allowOrigin = process.env.ACCESS_CONTROL_ALLOW_ORIGIN
console.log(`[Starter] Allow origin at ${allowOrigin}`)

app.use(helmet())
app.use(cors({
	origin: allowOrigin,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/sensor-log', sensorLogRoutes)
app.use('/api/device', deviceRoutes)
// app.use('/api/user-devices', userDeviceRoutes)

app.get('/api/health', (req, res) => {
	res.status(200).json({ status: 'success', message: 'API is running smoothly!' });
});

export default app;