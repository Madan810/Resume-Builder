import express from "express";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

import {
  createResume,
  getResumeById,
  deleteResume,
  getPublicResumeById,
  updateResume
} from "../controllers/resumeController.js";

const resumeRouter = express.Router();

resumeRouter.post("/create", protect, createResume);

resumeRouter.put(
  "/update",
  protect,
  upload.single("image"),
  updateResume
);

resumeRouter.delete("/delete/:resumeId", protect, deleteResume);

resumeRouter.get("/get/:resumeId", protect, getResumeById);

resumeRouter.get("/public/:resumeId", getPublicResumeById);

export default resumeRouter;
