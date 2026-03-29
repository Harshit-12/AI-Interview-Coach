import express from "express";
import InterviewSession from "../models/InterviewSession.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Get All Interviews

router.get("/all", protect, async(req,res) =>{
  try {
        console.log("Hello");
    const sessions = await InterviewSession.find({userId: req.user.userId})
    .sort({createdAt: -1});

    // loggin the session ids
    // for (var i=0;i<sessions.length;i++){
    //   const sessionId = sessions[i]._id;
    //   console.log("session "+ i+ " "+ sessionId);
    // }
    
    return res.json(sessions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Failed to fetch sessionss"});
  }
});

router.post("/create", protect, async (req, res) => {
  try {
    console.log("create hello");
    const { profile, survey } = req.body;
    const usuerDetails = req.user.userId;
    console.log("User id : "+ usuerDetails);
    const newSession = new InterviewSession({
      userId: req.user.userId,
      profile,
      survey,
      interviewHistory: []  // empty initially
    });

    const savedSession = await newSession.save();

    console.log("testing");
    res.json({
      sessionId: savedSession._id,
      message: "Interview session created successfully 🟢"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create session" });
  }
});
// Get an Interview Session

router.get("/:sessionId", async(req,res) =>{

  try {
    const {sessionId} = req.params;

    const session = await InterviewSession.findById(sessionId);

    if (!session){
      return res.status(404).json({error : "SessionId not found"});
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Failed to fetch session"});
  }
})



router.post("/add-response", protect, async (req, res) => {
  try {
    const { sessionId, question, answer, evaluation } = req.body;

    const updatedSession = await InterviewSession.findByIdAndUpdate(
      sessionId,
      {
        $push: {
          interviewHistory: {
            question,
            answer,
            evaluation
          }
        }
      },
      { new: true }
    );

    res.json({
      message: "Response added to session ✅",
      session: updatedSession
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update session" });
  }
});

export default router;