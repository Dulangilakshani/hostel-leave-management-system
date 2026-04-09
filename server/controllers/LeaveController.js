const Leave = require("../models/Leave");


// 🟢 1. CREATE LEAVE (Student)
const createLeave = async (req, res) => {
  try {
    const { leaveType, expectedReturnDateTime } = req.body;

    if (!leaveType || !expectedReturnDateTime) {
      return res.status(400).json({
        message: "Leave type and expected return time are required",
      });
    }

    // check existing pending leave
    const existingLeave = await Leave.findOne({
      studentId: req.user._id,
      status: "pending",
    });

    if (existingLeave) {
      return res.status(400).json({
        message: "You already have a pending leave",
      });
    }

    const leave = await Leave.create({
      studentId: req.user._id, // 🔥 IMPORTANT (history fix)
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
    console.log("CREATE LEAVE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// 🔵 2. RETURN LEAVE (Student)
const returnLeave = async (req, res) => {
  try {
    const leave = await Leave.findOne({
      studentId: req.user._id,
      status: "pending",
    });

    if (!leave) {
      return res.status(404).json({
        message: "No pending leave found",
      });
    }

    const now = new Date();

    leave.returnDateTime = now;

    // check late or on time
    if (now > new Date(leave.expectedReturnDateTime)) {
      leave.status = "late";
    } else {
      leave.status = "on_time";
    }

    await leave.save();

    res.status(200).json({
      message: "Return recorded successfully",
      leave,
    });

  } catch (error) {
    console.log("RETURN ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// 🟡 3. GET MY HISTORY (Student)
const getMyLeaves = async (req, res) => {
  try {
    console.log("USER ID:", req.user._id); // debug

    const leaves = await Leave.find({
      studentId: req.user._id,
    }).sort({ createdAt: -1 });

    console.log("FOUND LEAVES:", leaves); // debug

    res.status(200).json(leaves);

  } catch (error) {
    console.log("HISTORY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// 🔴 4. CURRENT OUT STUDENTS (Warden)
const getCurrentOut = async (req, res) => {
  try {
    const records = await Leave.find({
      status: "pending",
    }).sort({ createdAt: -1 });

    res.status(200).json(records);

  } catch (error) {
    console.log("CURRENT OUT ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// 🟠 5. LATE RETURNS (Warden)
const getLateReturns = async (req, res) => {
  try {
    const records = await Leave.find({
      status: "late",
    }).sort({ createdAt: -1 });

    res.status(200).json(records);

  } catch (error) {
    console.log("LATE RETURNS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// 🟣 6. ALL LEAVES (Warden)
const getAllLeaves = async (req, res) => {
  try {
    const records = await Leave.find().sort({ createdAt: -1 });

    res.status(200).json(records);

  } catch (error) {
    console.log("ALL LEAVES ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// 🟤 7. FILTER LEAVES (Warden)
const filterLeaves = async (req, res) => {
  try {
    const { year, roomNumber, leaveType } = req.query;

    const query = {};

    if (year) query.year = Number(year);
    if (roomNumber) query.roomNumber = roomNumber;
    if (leaveType) query.leaveType = leaveType;

    const leaves = await Leave.find(query).sort({ createdAt: -1 });

    res.status(200).json(leaves);

  } catch (error) {
    console.log("FILTER ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// ⚫ 8. REPORT (Warden)
const getReport = async (req, res) => {
  try {
    const total = await Leave.countDocuments();
    const late = await Leave.countDocuments({ status: "late" });
    const onTime = await Leave.countDocuments({ status: "on_time" });
    const pending = await Leave.countDocuments({ status: "pending" });

    res.status(200).json({
      total,
      late,
      onTime,
      pending,
    });

  } catch (error) {
    console.log("REPORT ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Monthly report data
const getMonthlyReport = async (req, res) => {
  try {
    const monthlyData = await Leave.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$leaveDateTime" },
            month: { $month: "$leaveDateTime" },
          },
          totalLeaves: { $sum: 1 },
          lateReturns: {
            $sum: {
              $cond: [{ $eq: ["$status", "late"] }, 1, 0],
            },
          },
          onTimeReturns: {
            $sum: {
              $cond: [{ $eq: ["$status", "on_time"] }, 1, 0],
            },
          },
          pendingLeaves: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const formattedData = monthlyData.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      totalLeaves: item.totalLeaves,
      lateReturns: item.lateReturns,
      onTimeReturns: item.onTimeReturns,
      pendingLeaves: item.pendingLeaves,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.log("MONTHLY REPORT ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Status chart data
const getStatusChartData = async (req, res) => {
  try {
    const total = await Leave.countDocuments();
    const late = await Leave.countDocuments({ status: "late" });
    const onTime = await Leave.countDocuments({ status: "on_time" });
    const pending = await Leave.countDocuments({ status: "pending" });

    const chartData = [
      { name: "Late", value: late },
      { name: "On Time", value: onTime },
      { name: "Pending", value: pending },
      { name: "Total", value: total },
    ];

    res.status(200).json(chartData);
  } catch (error) {
    console.log("STATUS CHART ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// 🔚 EXPORT ALL
module.exports = {
  createLeave,
  returnLeave,
  getMyLeaves,
  getCurrentOut,
  getLateReturns,
  getAllLeaves,
  filterLeaves,
  getReport,
  getMonthlyReport,
  getStatusChartData,
};