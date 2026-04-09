const Company = require("../models/Company");

// Add new company
const addCompany = async (req, res) => {
  try {
    const {
      companyName,
      role,
      package,
      eligibilityCgpa,
      eligibleDepartments,
      deadline,
      description,
      location,
    } = req.body;

    if (
      !companyName ||
      !role ||
      !package ||
      !eligibilityCgpa ||
      !eligibleDepartments ||
      !deadline
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newCompany = new Company({
      companyName,
      role,
      package,
      eligibilityCgpa,
      eligibleDepartments,
      deadline,
      description,
      location,
    });

    await newCompany.save();

    res.status(201).json({
      message: "Company added successfully",
      company: newCompany,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Companies fetched successfully",
      count: companies.length,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { addCompany, getAllCompanies };