const express = require("express");
const { addCompany, getAllCompanies } = require("../controllers/companyController");

const router = express.Router();

router.post("/add", addCompany);
router.get("/", getAllCompanies);

module.exports = router;