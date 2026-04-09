const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register student
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, department, cgpa, skills } = req.body;

    if (!name || !email || !password || !department || !cgpa) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      department,
      cgpa,
      skills: skills || [],
    });

    await newStudent.save();

    res.status(201).json({
      message: "Student registered successfully",
      student: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        department: newStudent.department,
        cgpa: newStudent.cgpa,
        skills: newStudent.skills,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login student
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        department: student.department,
        cgpa: student.cgpa,
        skills: student.skills,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerStudent, loginStudent };