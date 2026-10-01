const path = require("path");
const express = require("express");
const corsMiddleware = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");
const apiRoutes = require("./routes");

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use(corsMiddleware);

// Serve frontend static files from project root
const frontendPath = path.resolve(__dirname, "../../");
app.use(express.static(frontendPath));

// API Routes
app.use("/api", apiRoutes);

// Root route - serve frontend index.html if exists, otherwise status message
app.get("/", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.send("OrderCraft Backend is Running!");
        }
    });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
