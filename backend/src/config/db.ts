import mongoose from "mongoose";

const DIRECT_URI = "mongodb://muhammadsefat55_db_user:nVKdLG0RZaXpC6YR@ac-dyckxpm-shard-00-00.1eh7urg.mongodb.net:27017,ac-dyckxpm-shard-00-01.1eh7urg.mongodb.net:27017,ac-dyckxpm-shard-00-02.1eh7urg.mongodb.net:27017/robg1326?ssl=true&replicaSet=atlas-3cjnlz-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`⚠️ SRV connection failed, trying direct connection...`);
    try {
      const conn = await mongoose.connect(DIRECT_URI, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`🍃 MongoDB Connected (fallback): ${conn.connection.host}`);
    } catch (fallbackError: any) {
      console.error(`❌ MongoDB Connection Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
