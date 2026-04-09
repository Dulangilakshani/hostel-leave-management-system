const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["day_out", "out_going"],
      required: true,
    },
    leaveDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expectedReturnDateTime: {
      type: Date,
      required: true,
    },
    returnDateTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "on_time", "late"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Leave || mongoose.model("Leave", leaveSchema);