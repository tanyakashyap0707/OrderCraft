const express = require("express");
const router = express.Router();
const {
    getMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial
} = require("../controllers/materialController");

router.route("/")
    .get(getMaterials)
    .post(createMaterial);

router.route("/:id")
    .put(updateMaterial)
    .delete(deleteMaterial);

module.exports = router;
