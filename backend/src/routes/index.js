const express = require("express");
const router = express.Router();

const orderRoutes = require("./orderRoutes");
const materialRoutes = require("./materialRoutes");
const purchaseOrderRoutes = require("./purchaseOrderRoutes");
const bomRoutes = require("./bomRoutes");

router.use("/orders", orderRoutes);
router.use("/materials", materialRoutes);
router.use("/purchase-orders", purchaseOrderRoutes);
router.use("/boms", bomRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
