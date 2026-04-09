const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/user");

dotenv.config();

const createWarden = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const regNo = "WD001";
    const email = "warden@gmail.com";
    const plainPassword = "123456";

    await User.deleteOne({ regNo });

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const warden = await User.create({
      name: "Main Warden",
      regNo,
      email,
      password: hashedPassword,
      role: "warden",
      roomNumber: "Office",
      year: 2025,
    });

    console.log("Warden account created successfully");
    console.log({
      regNo: warden.regNo,
      password: plainPassword,
      role: warden.role,
    });

    process.exit();
  } catch (error) {
    console.error("Error creating warden:", error.message);
    process.exit(1);
  }
};

createWarden();