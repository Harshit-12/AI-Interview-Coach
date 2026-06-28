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
    const { profile, surveyData } = req.body;
    console.log("SAMPLE req.body: ", req.body);
    const surveyDataString = JSON.stringify(req.body.surveyData);
    // console.log("Profile data in session route: ", profile);
    console.log("Survey data in session route: ", surveyDataString);
    const surveyDetails = req.body.surveyData;
    const userId = req.user.userId;
    console.log("User id : "+ userId);
    const newSession = new InterviewSession({
      userId: req.user.userId,
      survey: {
        role: surveyDetails.role,
        experience: surveyDetails.experience,
        techStack: surveyDetails.techStack,
        difficulty: surveyDetails.difficulty
      },
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



router.get("/latest", protect, async (req, res) => {
  try {

    console.log("inside lates swession");

    const session = await InterviewSession.findOne({
      userId: req.user.userId
    }).sort({ createdAt: -1 });
    console.log("user id from latest " + req.user.userId);

    // if (!session) {
    //   return res.json({
    //     hasSession: false
    //   });
    // }
    console.log("session data " + JSON.stringify(session));
    // return res.json({
    //   hasSession: true,
    //   // sessionId: session._id
    // });
    
     return res.json(session);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch session" });
  }
});

  router.get("/check-profile", protect, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    if (!session) {
      return res.json({
        hasProfile: false
      });
    }

    return res.json({
      hasProfile: true,
      profile: session.profile,
      sessionId: session._id
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to check profile" });
  }
});

// Get an Interview Session

router.get("/:sessionId", async(req,res) =>{

  try {
    const {sessionId} = req.params;

    const session = await InterviewSession.findById(sessionId);
    console.log("session details "+ session);
    if (!session){
      return res.status(404).json({error : "SessionId not found"});
    }

    return res.json(session);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Failed to fetch session"});
  }
})

// fetch lates session for a user
// router.get("/latest", protect, async (req, res) => {
//   const session = await InterviewSession.findOne({
//     userId: req.user.userId
//   }).sort({ createdAt: -1 });

//   return res.json({ sessionId: session._id });
// });


router.post("/add-response", protect, async (req, res) => {
  try {
    const { sessionId, question, answer, evaluation } = req.body;

    console.log("Session ID= ", sessionId);
    console.log("Question= ", question);
    console.log("Answer= ", answer);
    console.log("Evaluation= ", evaluation);

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
      { new: true  }
    );

    return res.status(200).json({
      message: "Response added to session ✅",
      session: updatedSession
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update session" });
  }
});

export default router;