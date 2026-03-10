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
dotenv.config();
const app = express();

app.use(cors());
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
app.use("/api/session", sessionRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));