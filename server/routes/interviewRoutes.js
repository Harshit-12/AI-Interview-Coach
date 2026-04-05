import express from "express";
import { generateInterviewQuestions } from "../services/questionGenerator.js";

const router = express.Router();

// Logger with timestamp
const logger = {
  log: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO: ${message}`);
  },
  error: (message) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`);
  },
  warn: (message) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARN: ${message}`);
  }
};

const cleanJson = (text) =>
  text.replace(/```json|```/g, "").trim();



router.post("/startInterview", async (req, res) => {
  try {
    const { profile, surveyAnswers, previousQuestion, previousAnswer } = req.body;
    logger.log("StartInterview route clicked");
    logger.log("Starting question generation with profile and survey answers");
    const questionsText = await generateInterviewQuestions(
      profile,
      surveyAnswers,
      previousQuestion,
      previousAnswer
    );
    logger.log("Received questions text from generator");

    const questions = JSON.parse(cleanJson(questionsText));

    res.json({
      questions,
      message: "Interview questions generated successfully 🎤"
    });

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

export default router;