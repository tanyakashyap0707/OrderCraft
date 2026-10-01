const express = require("express");
const router = express.Router();
const {
    getBOMs,
    createBOM,
    deleteBOM
} = require("../controllers/bomController");

router.route("/")
    .get(getBOMs)
    .post(createBOM);

router.route("/:id")
    .delete(deleteBOM);

module.exports = router;
