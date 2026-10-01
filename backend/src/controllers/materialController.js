const Material = require("../models/Material");

/**
 * Get all materials
 */
const getMaterials = async (req, res, next) => {
    try {
        const materials = await Material.find().sort({ createdAt: -1 });
        res.json(materials);
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new material
 */
const createMaterial = async (req, res, next) => {
    try {
        const { name, unit, available, required, shortage, status } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Material name is required"
            });
        }

        const newMaterial = await Material.create({
            name,
            unit: unit || "kg",
            available: Number(available) || 0,
            required: Number(required) || 0,
            shortage: Number(shortage) || 0,
            status: status || "Available"
        });

        res.status(201).json({
            success: true,
            message: "Material saved successfully",
            material: newMaterial
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update material
 */
const updateMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedMaterial = await Material.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedMaterial) {
            return res.status(404).json({ success: false, message: "Material not found" });
        }

        res.json({
            success: true,
            message: "Material updated successfully",
            material: updatedMaterial
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete material
 */
const deleteMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedMaterial = await Material.findByIdAndDelete(id);

        if (!deletedMaterial) {
            return res.status(404).json({ success: false, message: "Material not found" });
        }

        res.json({
            success: true,
            message: "Material deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial
};
