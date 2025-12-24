import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  // No token provided
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  // Extract token if "Bearer token"
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export default protect;
