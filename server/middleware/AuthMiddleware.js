const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const isWarden = (req, res, next) => {
  if (req.user && req.user.role === "warden") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied (Warden only)" });
  }
};

module.exports = { protect, isWarden };