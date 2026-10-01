const mongoose = require("mongoose");

const bomSchema = new mongoose.Schema(
    {
        bomId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        product: {
            type: String,
            required: true,
            trim: true
        },
        version: {
            type: String,
            default: "v1.0"
        },
        materials: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                unit: { type: String, default: "kg" }
            }
        ],
        status: {
            type: String,
            enum: ["Active", "Draft", "Archived"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

const BOM = mongoose.model("BOM", bomSchema);

module.exports = BOM;
