const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { JWT_SECRET } = require("../config");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }

    // Update last active time
    user.lastActiveAt = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    console.error("Token error:", error);
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};
