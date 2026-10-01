const PurchaseOrder = require("../models/PurchaseOrder");

/**
 * Get all purchase orders
 */
const getPurchaseOrders = async (req, res, next) => {
    try {
        const purchaseOrders = await PurchaseOrder.find().sort({ createdAt: -1 });
        res.json(purchaseOrders);
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new purchase order
 */
const createPurchaseOrder = async (req, res, next) => {
    try {
        const { poId, supplier, material, quantity, date, status } = req.body;

        if (!supplier || !material || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Supplier, material, and quantity are required"
            });
        }

        const generatedId = poId || `PO-${Math.floor(1000 + Math.random() * 9000)}`;
        const orderDate = date || new Date().toISOString().split("T")[0];

        const newPO = await PurchaseOrder.create({
            poId: generatedId,
            supplier,
            material,
            quantity: Number(quantity),
            date: orderDate,
            status: status || "Pending"
        });

        res.status(201).json({
            success: true,
            message: "Purchase Order saved successfully",
            purchaseOrder: newPO
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update purchase order status
 */
const updatePurchaseOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedPO = await PurchaseOrder.findOneAndUpdate(
            { $or: [{ poId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            { status },
            { new: true }
        );

        if (!updatedPO) {
            return res.status(404).json({ success: false, message: "Purchase Order not found" });
        }

        res.json({
            success: true,
            message: "Purchase Order status updated successfully",
            purchaseOrder: updatedPO
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrderStatus
};
