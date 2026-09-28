import mongoose from "mongoose";
import dns from "dns";

// Fix SRV DNS resolution on Windows / Node
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if not supported in environment
}

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (isConnecting) {
    return;
  }

  try {
    isConnecting = true;
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn("⚠️ MONGODB_URI is not defined in environment variables");
      return;
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
