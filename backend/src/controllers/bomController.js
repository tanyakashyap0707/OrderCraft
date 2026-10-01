const BOM = require("../models/BOM");

/**
 * Get all BOMs
 */
const getBOMs = async (req, res, next) => {
    try {
        const boms = await BOM.find().sort({ createdAt: -1 });
        res.json(boms);
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new BOM
 */
const createBOM = async (req, res, next) => {
    try {
        const { bomId, product, version, materials, status } = req.body;

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product name is required"
            });
        }

        const generatedId = bomId || `BOM-${Math.floor(100 + Math.random() * 900)}`;

        const newBOM = await BOM.create({
            bomId: generatedId,
            product,
            version: version || "v1.0",
            materials: Array.isArray(materials) ? materials : [],
            status: status || "Active"
        });

        res.status(201).json({
            success: true,
            message: "BOM created successfully",
            bom: newBOM
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete BOM
 */
const deleteBOM = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await BOM.findOneAndDelete({
            $or: [{ bomId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
        });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "BOM not found" });
        }

        res.json({ success: true, message: "BOM deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBOMs,
    createBOM,
    deleteBOM
};
