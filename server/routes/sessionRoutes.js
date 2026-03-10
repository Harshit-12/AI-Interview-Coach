import express from "express";
import InterviewSession from "../models/InterviewSession.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { profile, survey } = req.body;

    const newSession = new InterviewSession({
      profile,
      survey,
      interviewHistory: []  // empty initially
    });

    const savedSession = await newSession.save();

    res.json({
      sessionId: savedSession._id,
      message: "Interview session created successfully 🟢"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create session" });
  }
});

export default router;