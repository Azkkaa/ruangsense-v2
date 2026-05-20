import 'dotenv/config'

import http from 'http'
import app from './src/app.js'
import connectDB from './src/config/db.js'
import { Server } from 'socket.io'
import { startListening } from './src/services/mqttHandler.js'

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

  socket.on('join-device-room', (device_id) => {
    socket.join(device_id)
    console.log(`[Socket] Client ${socket.id} join to room ${device_id}`)
  })

  socket.on('leave-device-room', (device_id) => {
    socket.leave(device_id)
    console.log(`[Socket] Client ${socket.id} leave to room ${device_id}`)
  })

  socket.on('disconnect', () => {
    console.log(`[Socket] Client terputus: ${socket.id}`);
  });
})

app.set('io', io)

const startServer = async () => {
  try {
    await connectDB()
    startListening(io)
    httpServer.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`)
    })
  } catch (err) {
    console.error('Failed to start the server:', err)
    process.exit(1)
  }
}

startServer()