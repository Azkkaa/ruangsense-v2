import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import sensorLogRoutes from './routes/sensorLogRoutes.js'
import deviceRoutes from './routes/deviceRoutes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/sensor-log', sensorLogRoutes)
app.use('/api/device', deviceRoutes)

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running smoothly!' });
});

export default app;