const express = require("express");
const { createAdmin, loginAdmin } = require("../controllers/adminController");

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);

module.exports = router;