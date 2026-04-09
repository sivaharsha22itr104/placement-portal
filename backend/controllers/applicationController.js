const Application = require("../models/Application");
const Student = require("../models/Student");
const Company = require("../models/Company");

const applyToCompany = async (req, res) => {
  try {
    const { studentId, companyId } = req.body;

    if (!studentId || !companyId) {
      return res.status(400).json({ message: "studentId and companyId are required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (student.cgpa < company.eligibilityCgpa) {
      return res.status(400).json({ message: "Student does not meet CGPA eligibility" });
    }

    if (!company.eligibleDepartments.includes(student.department)) {
      return res.status(400).json({ message: "Student department is not eligible" });
    }

    const existingApplication = await Application.findOne({ studentId, companyId });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this company" });
    }

    const newApplication = new Application({
      studentId,
      companyId,
    });

    await newApplication.save();

    res.status(201).json({
      message: "Applied successfully",
      application: newApplication,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId", "name email department cgpa")
      .populate("companyId", "companyName role package");

    res.status(200).json({
      message: "Applications fetched successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getStudentApplications = async (req, res) => {
  try {
    const { studentId } = req.params;

    const applications = await Application.find({ studentId })
      .populate("companyId", "companyName role package location");

    res.status(200).json({
      message: "Student applications fetched",
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatus = ["Applied", "Shortlisted", "Rejected", "Selected"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  applyToCompany,
  getAllApplications,
  getStudentApplications,
  updateApplicationStatus
};