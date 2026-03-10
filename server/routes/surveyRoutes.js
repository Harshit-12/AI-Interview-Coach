import express from "express";

const router = express.Router();

router.get("/questions", (req, res) => {
  const questions = [
    "What role are you targeting?",
    "Which companies are you aiming for?",
    "How many years of experience do you have?",
    "What type of interview do you want? (Technical / HR / Mixed)",
    "Select difficulty level (Easy / Medium / Hard)",
    "What are your strongest technical skills?",
    "Which topics do you want to improve?"
  ];

  res.json({ surveyQuestions: questions });
});

export default router;