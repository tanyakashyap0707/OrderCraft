const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        unit: {
            type: String,
            required: true,
            trim: true,
            default: "kg"
        },
        available: {
            type: Number,
            required: true,
            default: 0
        },
        required: {
            type: Number,
            default: 0
        },
        shortage: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            default: "Available"
        }
    },
    {
        timestamps: true
    }
);

// Recalculate shortage and status before saving (Mongoose 9 uses promise/sync hook without next parameter)
materialSchema.pre("save", function () {
    const available = Number(this.available) || 0;
    const required = Number(this.required) || 0;

    if (required > available) {
        this.shortage = required - available;
        this.status = "Shortage";
    } else {
        this.shortage = 0;
        this.status = "Available";
    }
});

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
