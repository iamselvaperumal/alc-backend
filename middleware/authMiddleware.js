const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  // let token;

  res.header("Access-Control-Allow-Origin", "https://alc-project-jtm7.vercel.app");
  res.header("Access-Control-Allow-Credentials", "false");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Allow OPTIONS without token
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  // // Check for token in Authorization header or cookies
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // } else if (req.cookies && req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // if (!token) {
  //   return res.status(401).json({ message: "Not authorized, no token" });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = await User.findById(decoded.id).select("-password");

    // if (!req.user) {
    //   return res.status(401).json({ message: "User not found, token invalid" });
    // }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, adminOnly };
