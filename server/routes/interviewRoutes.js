import express from "express";
import { generateInterviewQuestions } from "../services/questionGenerator.js";

const router = express.Router();

const cleanJson = (text) =>
  text.replace(/```json|```/g, "").trim();



router.post("/startInterview", async (req, res) => {
  try {
    const { profile, surveyAnswers } = req.body;
    console.log("StartInterview route clicked");
    const questionsText = await generateInterviewQuestions(
      profile,
      surveyAnswers
    );

    const questions = JSON.parse(cleanJson(questionsText));

    res.json({
      questions,
      message: "Interview questions generated successfully 🎤"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

export default router;