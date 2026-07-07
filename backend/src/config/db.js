import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.ENVIRONMENT === 'production' ?  process.env.MONGO_PROD_URI : process.env.MONGO_DEV_URI
    )
  } catch (err) {
    console.error("Error:", err)
    process.exit(1)
  }
}

export default connectDb;