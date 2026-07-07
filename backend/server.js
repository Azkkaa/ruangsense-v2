import 'dotenv/config'
import http from 'http'
import app from './src/app.js'
import connectDB from './src/config/db.js'
import { Server } from 'socket.io'
import { startListening } from './src/services/mqttHandler.js'
import mqttClient from './src/config/mqtt.js'
import { updateDeviceConfigSocket } from './src/controllers/deviceController.js'
import { initWhatsappBot } from './src/bot.js'

const PORT = process.env.PORT

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log(`[Socket] Client Connected: ${socket.id}`)

  socket.on('join-device-room', (deviceId) => {
    socket.join(deviceId)
    console.log(`[Socket] Client ${socket.id} join to DATA room ${deviceId}`)
  })

  socket.on('join-notif-room', (deviceId) => {
    socket.join(deviceId)
    console.log(`[Socket] Client ${socket.id} join to NOTIF room ${deviceId}`)
  })

  socket.on('leave-notif-room', (deviceId) => {
    socket.leave(deviceId)
    console.log(`[Socket] Client ${socket.id} leave from NOTIF room ${deviceId}`)
  })

  socket.on('leave-device-room', (deviceId) => {
    socket.leave(deviceId)
    console.log(`[Socket] Client ${socket.id} leave to room ${deviceId}`)
  })

  socket.on('disconnect', () => {
    console.log(`[Socket] Client terputus: ${socket.id}`);
  });

  socket.on('update-device-config', (data) => {
      updateDeviceConfigSocket(data, mqttClient)
  });
})

app.set('io', io)

const startServer = async () => {
  try {
    await connectDB()
    startListening(io)

    initWhatsappBot(io)
  
    httpServer.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`)
    })
  } catch (err) {
    console.error('Failed to start the server:', err)
    process.exit(1)
  }
}

startServer()