import express from "express";
import multer from "multer";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import UserProfile from "../models/UserProfile.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router(); 
import PDFDocument from "pdfkit";
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
    console.log("Cleaned Profile Text: ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", cleanedProfile);
    const profileData = JSON.parse(cleanedProfile);
    console.log("Extracted Profile Data:", profileData);
      const userProfileData = await UserProfile.findOneAndUpdate(
      { userId: req.user.userId },
      {
        name: profileData.name,
        email: profileData.email,
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


router.get("/generate", protect, async (req, res) => {
  try {

    const profile = await UserProfile.findOne({
      userId: req.user.userId
    });

    const formatDate = (date) => {
      if (!date) return "Present";

      return new Date(date).toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "numeric"
        }
      );
  };

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found"
      });
    }

    const doc = new PDFDocument({
      margin: 50
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=resume.pdf"
    );

    doc.pipe(res);

    // ==========================
    // Header
    // ==========================

    doc
      .fontSize(22)
      .text(profile.name || "", {
        align: "center"
      });

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .text(profile.email || "", {
        align: "center"
      });

    doc.moveDown();

    // ==========================
    // Skills
    // ==========================

    doc
      .fontSize(16)
      .text("SKILLS");

    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(0.5);

    doc.fontSize(11);

    // profile.skills?.forEach(skill => {
    //   doc.text(`• ${skill}`);
    // });

    doc
  .fontSize(11)
  .font("Helvetica")
  .text(profile.skills?.join(" • "));

    doc.moveDown();

    // ==========================
    // Experience
    // ==========================

    doc
      .fontSize(16)
      .text("EXPERIENCE");

    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(0.5);

    profile.experience?.forEach(exp => {

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(exp.role || "");

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(
          `${exp.company || ""} |  ${
            formatDate(exp.startDate) || ""
          } - ${formatDate(exp.endDate) || ""
          }`
        );

      doc.text(exp.description || "");

      doc.moveDown();
    });

    // ==========================
    // Projects
    // ==========================

    doc
      .fontSize(16)
      .text("PROJECTS");

    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(0.5);

    profile.projects?.forEach(project => {

      // doc
      //   .fontSize(12)
      //   .font("Helvetica-Bold")
      //   .text(`${project.title || ""} |  ${project.startDate || ""} - ${project.endDate || ""}`
      //   );
        
      doc
  .fontSize(12)
  .font("Helvetica-Bold")
  .text(project.title || "", {
    continued: true
  });

doc
  .fontSize(10)
  .font("Helvetica")
  .text(
    ` | ${formatDate(project.startDate)} - ${formatDate(project.endDate)}`
  );
      doc
        .font("Helvetica")
        .fontSize(11)
        .text(project.description || "");

      if (
        project.technologies &&
        project.technologies.length
      ) {
        doc.text(
          `Technologies: ${project.technologies.join(", ")}`
        );
      }

      doc.moveDown();
    });

    // ==========================
    // Education
    // ==========================

    doc
      .fontSize(16)
      .text("EDUCATION");

    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(0.5);

    profile.education?.forEach(edu => {

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(edu.degree || "");

      doc
        .font("Helvetica")
        .fontSize(11)
        .text(
          `${edu.institution || ""} |   ${formatDate(edu.startDate) || ""} - ${
          formatDate(edu.endDate) || ""
        }`
        );

      // doc.text(
      //   `${edu.startDate || ""} - ${
      //     edu.endDate || ""
      //   }`
      // );

      doc.moveDown();
    });

    doc.end();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to generate resume"
    });
  }
});


export default router;