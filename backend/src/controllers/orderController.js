const Order = require("../models/Order");

/**
 * Get all orders
 */
const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

/**
 * Get single order by orderId or _id
 */
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({
            $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new order
 */
const createOrder = async (req, res, next) => {
    try {
        const { orderId, customer, product, quantity, date, status } = req.body;

        if (!customer || !product || !quantity || !date) {
            return res.status(400).json({
                success: false,
                message: "Please provide customer, product, quantity, and date"
            });
        }

        const generatedId = orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

        const newOrder = await Order.create({
            orderId: generatedId,
            customer,
            product,
            quantity: Number(quantity),
            date,
            status: status || "Pending"
        });

        res.status(201).json({
            success: true,
            message: "Order saved successfully",
            order: newOrder
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update order status
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete order
 */
const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findOneAndDelete({
            $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
        });

        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder
};
