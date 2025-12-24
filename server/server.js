import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7001;

// ===============================
// Middlewares
// ===============================
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true
}));

app.use(express.json());

// ===============================
// Health Check Route
// ===============================
app.get("/", (req, res) => {
  res.status(200).send("Server is live...");
});

// ===============================
// API Routes
// ===============================
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

// ===============================
// Force restart: 5
// ===============================
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    // IMPORTANT: Do NOT bind to 0.0.0.0 on Windows
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();
