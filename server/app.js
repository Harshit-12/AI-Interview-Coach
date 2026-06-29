import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { connectDB } from "./config/db.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import speechRoutes from "./routes/speechRoutes.js";
import dns from "dns";

dotenv.config();
const app = express();


dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
app.use(cors({
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL
    ],
    credentials: true
  }));
  
app.use(express.json());


connectDB();
app.get("/", (req, res) => {
  res.send("AI Interview Simulator Backend Running 🚀");
});

app.use("/api/resume", resumeRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/profile", profileRoutes);
app.use(
  "/api/speech",  speechRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));