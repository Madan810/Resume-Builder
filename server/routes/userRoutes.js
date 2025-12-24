import express from "express";
import {
  registerUser,
  loginUser,
  getUserId,
  getUserResumes,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";

import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/data", protect, getUserId);
userRouter.get("/resumes", protect, getUserResumes);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
