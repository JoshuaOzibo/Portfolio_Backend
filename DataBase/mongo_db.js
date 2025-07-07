import mongoose from "mongoose";

let isConnected = false; // 🧠 Persist connection status across calls

const connectDb = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true; // ✅ Cache the connection
    console.log("✅ MongoDB connected:", conn.connection.host);

    // Optional: Setup listeners (only once)
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      isConnected = true;
      console.log("🔄 MongoDB reconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error; // Let calling code handle the failure
  }
};

export default connectDb;
