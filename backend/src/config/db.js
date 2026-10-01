const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.warn("⚠️ MONGO_URI is not defined in environment variables. Database operations may fail.");
            return;
        }

        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
    }
};

module.exports = connectDB;
