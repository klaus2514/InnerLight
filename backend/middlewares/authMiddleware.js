const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // ✅ Stop here if successful
    } catch (error) {
      console.error("Token error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // 🔐 Only run if no token was found at all
  return res.status(401).json({ message: "Not authorized, no token" });
};

module.exports = { protect };
