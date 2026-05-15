import 'dotenv/config'

import app from './src/app.js'
import connectDB from './src/config/db.js'

const PORT = process.env.PORT

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`)
    })
  } catch (err) {
    console.error('Failed to start the server:', err)
    process.exit(1)
  }
}

startServer()