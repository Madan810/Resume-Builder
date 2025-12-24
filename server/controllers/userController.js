import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";
import sendEmail from "../utils/sendEmail.js";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ===============================
// USER REGISTRATION
// POST: /api/users/register
// ===============================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(newUser._id);

    newUser.password = undefined; // hide password

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

// ===============================
// USER LOGIN
// POST: /api/users/login
// ===============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    user.password = undefined;

    return res.status(200).json({
      message: "Login successfully",
      token,
      user,
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ===============================
// GET USER BY ID
// GET: /api/users/data
// ===============================
export const getUserId = async (req, res) => {
  try {
    const userId = req.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = undefined;

    return res.status(200).json({ user });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//controller for getting user resumes
//GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;

    //return user resumes
    const resumes = await Resume.find({ userId })
    return res.status(200).json({ resumes })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// ===============================
// FORGOT PASSWORD
// POST: /api/users/forgot-password
// ===============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token (simple random string for MVP)
    const resetToken = Math.random().toString(36).substring(2, 11);

    // Set token and expiration (10 minutes)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Send email
    try {
      await sendEmail({
        email: user.email,
        subject: "Resume Builder Password Reset",
        message: `Your password reset token is: ${resetToken}\n\nThis token will expire in 10 minutes.`,
      });

      console.log(`Email sent to ${email} with token ${resetToken}`);

      return res.status(200).json({
        message: "Reset code sent to your email",
        // resetToken: resetToken // Disabled Screen Display for security
      });
    } catch (error) {
      console.error("Email send error:", error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent. Check server logs." });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ===============================
// RESET PASSWORD
// POST: /api/users/reset-password
// ===============================
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Missing token or password" })
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};