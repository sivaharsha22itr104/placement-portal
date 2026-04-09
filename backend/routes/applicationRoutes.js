const express = require("express");
const {
  applyToCompany,
  getAllApplications,
  updateApplicationStatus,
  getStudentApplications
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/apply", applyToCompany);
router.get("/", getAllApplications);
router.get("/student/:studentId", getStudentApplications);
router.put("/status/:applicationId", updateApplicationStatus);

module.exports = router;