import express from "express";
import { evaluateAnswer } from "../services/answerEvaluator.js";

const router = express.Router();

const cleanJson = (text) =>
  text.replace(/```json|```/g, "").trim();

router.post("/evaluate", async (req, res) => {
  try {

    // res.status(200).send("Evaluation Started");
    const { question, answer, profile } = req.body;
    
    const evaluationText = await evaluateAnswer(
      question,
      answer,
      profile
    );

    const evaluation = JSON.parse(cleanJson(evaluationText));
    console.log(evaluation);
    res.json({
      evaluation,
      message: "Answer evaluated successfully 🧠"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Evaluation failed" });
  }
});

export default router;