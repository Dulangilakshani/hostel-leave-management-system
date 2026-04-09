const Leave = require("../models/Leave");

// Create Leave
const createLeave = async (req, res) => {
  try {
    const { leaveType, expectedReturnDateTime } = req.body;

    if (!leaveType || !expectedReturnDateTime) {
      return res.status(400).json({ message: "Leave type and expected return time are required" });
    }

    const pendingLeave = await Leave.findOne({
      studentId: req.user._id,
      status: "pending",
    });

    if (pendingLeave) {
      return res.status(400).json({ message: "You already have a pending leave record" });
    }

    const leave = await Leave.create({
      studentId: req.user._id,
      name: req.user.name,
      regNo: req.user.regNo,
      roomNumber: req.user.roomNumber,
      year: req.user.year,
      leaveType,
      leaveDateTime: new Date(),
      expectedReturnDateTime,
      status: "pending",
    });

    res.status(201).json({
      message: "Leave recorded successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Return Leave
const returnLeave = async (req, res) => {
  try {
    const pendingLeave = await Leave.findOne({
      studentId: req.user._id,
      status: "pending",
    });

    if (!pendingLeave) {
      return res.status(404).json({ message: "No pending leave record found" });
    }

    const now = new Date();
    pendingLeave.returnDateTime = now;

    if (now > new Date(pendingLeave.expectedReturnDateTime)) {
      pendingLeave.status = "late";
    } else {
      pendingLeave.status = "on_time";
    }

    await pendingLeave.save();

    res.status(200).json({
      message: "Return recorded successfully",
      leave: pendingLeave,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// My Leave History
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get students currently out
const getCurrentOut = async (req, res) => {
  try {
    const records = await Leave.find({ status: "pending" }).sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get late students
const getLateReturns = async (req, res) => {
  try {
    const records = await Leave.find({ status: "late" }).sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all records
const getAllLeaves = async (req, res) => {
  try {
    const records = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLeave,
  returnLeave,
  getMyLeaves,
  getCurrentOut,
  getLateReturns,
  getAllLeaves,
};