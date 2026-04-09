const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  try {
    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    token = req.headers.authorization.split(" ")[1];
    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("AUTH ERROR FULL:", error);
    console.log("AUTH ERROR MESSAGE:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };