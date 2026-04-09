const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  resetPassword,
} = require("../controllers/AuthController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/reset-password", resetPassword);

module.exports = router;