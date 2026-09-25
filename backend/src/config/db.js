import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri)
  } catch (err) {
    console.error("Error:", err)
    process.exit(1)
  }
}

export default connectDb;