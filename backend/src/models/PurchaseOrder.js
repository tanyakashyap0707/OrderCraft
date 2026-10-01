const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
    {
        poId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        supplier: {
            type: String,
            required: true,
            trim: true
        },
        material: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        date: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "In Transit", "Received", "Cancelled"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

module.exports = PurchaseOrder;
