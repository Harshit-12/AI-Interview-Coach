import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import UserProfile from "../models/UserProfile.js";
import User from "../models/user.js";
import user from "../models/user.js";

const router = express.Router();

console.log("Profile routes loaded");
 
router.get("/", protect, async (req, res) => {
  try {
    console.log("inside profile");
    console.log("User ID from token: ", req.user.userId);
    const profile = await UserProfile.findOne({
      userId: req.user.userId
    });
    console.log("user id ", req.user.userId);
    console.log("Profile found: ", profile);
    if (!profile) {
      return res.json({
      hasProfile : false
    })
    }
    return res.json({
      hasProfile: true,
      profile
    });

  } catch (error) {
    console.log("my error ",error);
    return res.status(500).json({
      error: "Failed to fetch profile"
    });
  }
});

// router.put(
//   "/update",
//   protect,
//   async (req, res) => {

//     const updatedProfile =
//       await UserProfile.findOneAndUpdate(
//         { userId: req.user.userId },
//         req.body,
//         { new: true }
//       );

//     res.json(updatedProfile);
//   }
// );


router.put("/update", protect, async (req, res) => {
  try {

    console.log("expereice data+++ ", JSON.stringify(req.body));
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: req.user.userId },

      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          skills: req.body.skills,
          experience: req.body.experience,
          education: req.body.education,
          projects: req.body.projects
        }
      },

      { new: true,
        upsert: true
       }
    );

    res.json({
      message: "Profile updated successfully",
      profile: updatedProfile
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update profile"
    });
  }
});

export default router;