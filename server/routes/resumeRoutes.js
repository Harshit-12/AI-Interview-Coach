import express from "express";
import multer from "multer";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const router = express.Router(); 
import { extractCandidateProfile } from "../services/profileExtractor.js";

const upload = multer({ dest: "uploads/" });

router.post("/upload-resume", upload.single("resume"), async (req, res) => {
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
    res.json({
      resumeText: textContent,
      candidateProfile: JSON.parse(cleanedProfile),
      message: "Resume analyzed successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Resume analysis failed" });
  }
});

export default router;