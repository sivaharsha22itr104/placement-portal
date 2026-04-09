const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    package: {
      type: Number,
      required: true,
    },
    eligibilityCgpa: {
      type: Number,
      required: true,
    },
    eligibleDepartments: {
      type: [String],
      required: true,
      default: [],
    },
    deadline: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);