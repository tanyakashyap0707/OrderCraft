const express = require("express");
const router = express.Router();
const {
    getPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrderStatus
} = require("../controllers/purchaseOrderController");

router.route("/")
    .get(getPurchaseOrders)
    .post(createPurchaseOrder);

router.route("/:id/status")
    .put(updatePurchaseOrderStatus);

module.exports = router;
