const express = require("express");
const router = express.Router();

const {
  createLeave,
  returnLeave,
  getMyLeaves,
  getCurrentOut,
  getLateReturns,
  getAllLeaves,
} = require("../controllers/LeaveController");

const {
  protect,
  isWarden,
  isStudent,
} = require("../middleware/AuthMiddleware");

// Student routes
router.post("/create", protect, isStudent, createLeave);
router.put("/return", protect, isStudent, returnLeave);
router.get("/my-history", protect, isStudent, getMyLeaves);

// Warden routes
router.get("/current-out", protect, isWarden, getCurrentOut);
router.get("/late", protect, isWarden, getLateReturns);
router.get("/all", protect, isWarden, getAllLeaves);

module.exports = router;