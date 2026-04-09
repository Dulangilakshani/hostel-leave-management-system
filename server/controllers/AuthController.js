const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerUser = async (req, res) => {
  try {
    const { name, regNo, email, password, role, roomNumber, year } = req.body;

    if (!name || !regNo || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { regNo }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      regNo,
      email,
      password: hashedPassword,
      role: role || "student",
      roomNumber,
      year,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        regNo: user.regNo,
        email: user.email,
        role: user.role,
        roomNumber: user.roomNumber,
        year: user.year,
      },
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN REQUEST:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        regNo: user.regNo,
        email: user.email,
        role: user.role,
        roomNumber: user.roomNumber,
        year: user.year,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };