const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // We won't exit the process immediately so we can still test the health endpoint and connection failure response if DB is down.
    // Or we exit - usually exiting is standard, but let's just log and throw or let the application run but return failure.
    // Actually, exiting is standard but let's throw it to be handled, or exit after logging. Let's do exit(1) but log it clearly.
    console.error('Please make sure MongoDB is running.');
    process.exit(1);
  }
};

module.exports = connectDB;
