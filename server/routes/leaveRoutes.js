const express = require("express");
const router = express.Router();

const {
  createLeave,
  returnLeave,
  getMyLeaves,
  getCurrentOut,
  getLateReturns,
  getAllLeaves,
  filterLeaves,
  getReport,
} = require("../controllers/LeaveController"); // ✅ FIXED (small l)

const { protect, isWarden } = require("../middleware/AuthMiddleware"); // ✅ FIXED

// student routes
router.post("/create", protect, createLeave);
router.put("/return", protect, returnLeave);
router.get("/my-history", protect, getMyLeaves);

// warden routes
router.get("/current-out", protect, isWarden, getCurrentOut);
router.get("/late", protect, isWarden, getLateReturns);
router.get("/all", protect, isWarden, getAllLeaves);
router.get("/filter", protect, isWarden, filterLeaves);
router.get("/report", protect, isWarden, getReport);

module.exports = router;