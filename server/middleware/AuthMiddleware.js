const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Protect routes - logged in users only
const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Warden only
const isWarden = (req, res, next) => {
  if (req.user && req.user.role === "warden") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Warden only." });
  }
};

// Student only
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Student only." });
  }
};

module.exports = {
  protect,
  isWarden,
  isStudent,
};