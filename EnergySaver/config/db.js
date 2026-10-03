const mongoose = require('mongoose');

// Connect to MongoDB (Atlas with local fallback)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/energysaver', { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Atlas connection failed, connecting to local MongoDB...');
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/energysaver');
    console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
  }
};

module.exports = connectDB;
