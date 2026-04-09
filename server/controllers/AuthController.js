const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register - student only from public page
const registerUser = async (req, res) => {
  try {
    const { name, regNo, email, password, roomNumber, year } = req.body;

    if (!name || !regNo || !email || !password || !roomNumber || !year) {
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
      role: "student",
      roomNumber,
      year: Number(year),
    });

    res.status(201).json({
      message: "Student registered successfully",
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

// Login with regNo + password
const loginUser = async (req, res) => {
  try {
    const { regNo, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!regNo || !password) {
      return res.status(400).json({
        message: "Registration number and password are required",
      });
    }

    const user = await User.findOne({ regNo: regNo.trim() });

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

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { regNo, newPassword } = req.body;

    if (!regNo || !newPassword) {
      return res.status(400).json({
        message: "Registration number and new password are required",
      });
    }

    const user = await User.findOne({ regNo: regNo.trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, resetPassword };