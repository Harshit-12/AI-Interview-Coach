import express from "express";
import { generateInterviewReport } from "../services/reportGenerator.js";

const router = express.Router();

const cleanJson = (text) =>
  text.replace(/```json|```/g, "").trim();

router.post("/final-report", async (req, res) => {
  try {
    const { profile, surveyAnswers, interviewHistory } = req.body;

    const reportText = await generateInterviewReport(
      profile,
      surveyAnswers,
      interviewHistory
    );

    const report = JSON.parse(cleanJson(reportText));

    res.json({
      report,
      message: "Final interview report generated 📊"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Report generation failed" });
  }
});

export default router;