import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use the environment variable MONGODB_URI if available, otherwise use the local URI
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/3nigma";

    await mongoose.connect(mongoURI);

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;

