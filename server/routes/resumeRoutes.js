import express from "express";
import multer from "multer";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import UserProfile from "../models/UserProfile.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router(); 
import { extractCandidateProfile } from "../services/profileExtractor.js";

const upload = multer({ dest: "uploads/" });

router.post("/upload-resume", protect , upload.single("resume"), async (req, res) => {
  try {

     if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    console.log("Uploaded file:", req.file);
    const filePath = req.file.path;
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let textContent = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      const pageText = text.items.map(item => item.str).join(" ");
      textContent += pageText + "\n";
    }

    //  AI Profile Extraction
    const profile = await extractCandidateProfile(textContent);
    console.log(profile);
    const cleanJson = (text) => {
    return text
    .replace(/```json/g, "")  // remove ```json
    .replace(/```/g, "")      // remove ```
    .trim();
    };

    const cleanedProfile = cleanJson(profile);
    
    const profileData = JSON.parse(cleanedProfile);
    console.log("Extracted Profile Data:", profileData);
      const userProfileData = await UserProfile.findOneAndUpdate(
      { userId: req.user.userId },
      {
        name: profileData.name,
        skills: profileData.skills,
        experience: profileData.experience,
        education: profileData.education,
        projects: profileData.projects,
        resumeText: textContent,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Save the profile data to the database
      await userProfileData.save();

      const details  =  res.json({
      resumeText: textContent,
      candidateProfile: JSON.parse(cleanedProfile),
      message: "Resume analyzed successfully"
    });
    
    console.log(details);
    return details;

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Resume analysis failed" });
  }
});

export default router;