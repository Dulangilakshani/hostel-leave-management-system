const express = require("express");
const router = express.Router();
const { createLeave, returnLeave, getMyLeaves } = require("../controllers/LeaveController");
const { protect } = require("../middleware/AuthMiddleware");

router.post("/create", protect, createLeave);
router.put("/return", protect, returnLeave);
router.get("/my-history", protect, getMyLeaves);

module.exports = router;