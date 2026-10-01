const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from backend/.env or backend/backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });
if (!process.env.MONGO_URI) {
    dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}
if (!process.env.MONGO_URI) {
    dotenv.config({ path: path.resolve(__dirname, "../backend/.env") });
}

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`🚀 OrderCraft Server running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints available at http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err.message);
});

module.exports = server;
