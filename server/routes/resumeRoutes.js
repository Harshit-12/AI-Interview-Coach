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
const addSectionHeading = (title) => {

  doc.moveDown(0.5);

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("black")
    .text(title);

  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  doc.moveDown(0.3);
};

doc
  .font("Helvetica-Bold")
  .fontSize(22)
  .fillColor("black")
  .text(profile.name || "", {
    align: "center"
  });

let contactInfo = [];

if (profile.email)
  contactInfo.push(profile.email);

if (profile.contactNumber)
  contactInfo.push(profile.contactNumber);

if (profile.linkedinUrl)
  contactInfo.push(profile.linkedinUrl);

if (profile.githubUrl)
  contactInfo.push(profile.githubUrl);

doc
  .font("Helvetica")
  .fontSize(10)
  .fillColor("blue")
  .text(contactInfo.join(" | "), {
    align: "center"
  });

doc.fillColor("black");

doc.moveDown();

addSectionHeading("SKILLS");

doc
  .font("Helvetica")
  .fontSize(11)
  .text(profile.skills?.join(" | ") || "");

  if (profile.experience?.length) {

  addSectionHeading("EXPERIENCE");

  profile.experience.forEach((exp) => {

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(exp.role || "", {
        continued: true
      });

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        ` | ${exp.company || ""} | ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`
      );

    if (exp.description) {
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(exp.description);
    }

    doc.moveDown(0.5);
  });
}

if (profile.projects?.length) {

  addSectionHeading("PROJECTS");

  profile.projects.forEach((project) => {

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(project.title || "", {
        continued: true
      });

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        ` | ${formatDate(project.startDate)} - ${formatDate(project.endDate)}`
      );

    if (project.description) {
      doc
        .font("Helvetica")
        .fontSize(11)
        .text(project.description);
    }

    if (project.technologies?.length) {

      doc
        .font("Helvetica-Oblique")
        .fontSize(10)
        .text(
          `Technologies: ${project.technologies.join(", ")}`
        );
    }

    doc.moveDown(0.5);
  });
}


if (profile.education?.length) {

  addSectionHeading("EDUCATION");

  profile.education.forEach((edu) => {

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(edu.degree || "", {
        continued: true
      });

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        ` | ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`
      );

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(edu.institution || "");

    doc.moveDown(0.5);
  });
}

if (profile.certifications?.length) {

  addSectionHeading("CERTIFICATIONS");

  doc
    .font("Helvetica")
    .fontSize(11)
    .text(
      profile.certifications.join(" | ")
    );
}

  doc.end();
  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to generate resume"
    });
  }
});


// router.get("/generate", protect, async (req, res) => {
//   try {

//     const profile = await UserProfile.findOne({
//       userId: req.user.userId
//     });

//     const formatDate = (date) => {
//       if (!date) return "Present";

//       return new Date(date).toLocaleDateString(
//         "en-US",
//         {
//           month: "short",
//           year: "numeric"
//         }
//       );
//   };

//     if (!profile) {
//       return res.status(404).json({
//         error: "Profile not found"
//       });
//     }

//     const doc = new PDFDocument({
//       margin: 50
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/pdf"
//     );

//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=resume.pdf"
//     );

//     doc.pipe(res);

//     // ==========================
//     // Header
//     // ==========================

//     doc
//   .fontSize(16).font("Helvetica-Bold")
//   .text(profile.name || "", {
//     align: "left"
    
//   });

 

//   doc.moveDown();

//       doc
//       .fontSize(16).font("Helvetica")
//       .text("BASIC INFORMATION");

//       doc.moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .stroke();
    
//       doc.moveDown(0.5);

  

//       doc
//         .fontSize(11)
//         .font("Helvetica")
//         .text(`• Email :  ${profile.email || ""}`);
      
    
//       doc.moveDown(0.5);
// if (profile.contactNumber) {
//     doc
//         .fontSize(11)
//         .font("Helvetica")
//         .text(`• Contact Number :  ${profile.contactNumber || ""}`);
      
    
//       doc.moveDown(0.5);
// }

// if (profile.linkedinUrl) {
//       doc
//         .fontSize(11)
//         .font("Helvetica")
//         .text(`• LinkedIn URL : ${profile.linkedinUrl || ""}`);
//          doc.moveDown(0.5);

// }

       

//   if (profile.githubUrl) {

//       doc
//         .fontSize(11)
//         .font("Helvetica")
//         .text(`• GitHub URL : ${profile.githubUrl || ""}`)
      
        
//       doc.moveDown(0.5);

//   }
    
//       doc.moveDown(0.5);






//     // ==========================
//     // Skills
//     // ==========================

//     doc
//       .fontSize(16)
//       .text("SKILLS");

//     doc.moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .stroke();

//     doc.moveDown(0.5);

//     doc.fontSize(11);

//     // profile.skills?.forEach(skill => {
//     //   doc.text(`• ${skill}`);
//     // });

//     doc
//   .fontSize(11)
//   .font("Helvetica")
//   .text(profile.skills?.join(" • "));

//     doc.moveDown();

//     // ==========================
//     // Experience
//     // ==========================

//     doc
//       .fontSize(16)
//       .text("EXPERIENCE");

//     doc.moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .stroke();

//     doc.moveDown(0.5);

//     profile.experience?.forEach(exp => {

//       doc
//         .fontSize(12)
//         .font("Helvetica-Bold")
//         .text(exp.role || "");

//       doc
//         .font("Helvetica")
//         .fontSize(11)
//         .text(
//           `${exp.company || ""} |  ${
//             formatDate(exp.startDate) || ""
//           } - ${formatDate(exp.endDate) || ""
//           }`
//         );

//       doc.text(exp.description || "");

//       doc.moveDown();
//     });

//     // ==========================
//     // Projects
//     // ==========================

//     doc
//       .fontSize(16)
//       .text("PROJECTS");

//     doc.moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .stroke();

//     doc.moveDown(0.5);

//     profile.projects?.forEach(project => {

//       // doc
//       //   .fontSize(12)
//       //   .font("Helvetica-Bold")
//       //   .text(`${project.title || ""} |  ${project.startDate || ""} - ${project.endDate || ""}`
//       //   );
        
//       doc
//   .fontSize(12)
//   .font("Helvetica-Bold")
//   .text(project.title || "", {
//     continued: true
//   });

// doc
//   .fontSize(10)
//   .font("Helvetica")
//   .text(
//     ` | ${formatDate(project.startDate)} - ${formatDate(project.endDate)}`
//   );
//       doc
//         .font("Helvetica")
//         .fontSize(11)
//         .text(project.description || "");

//       if (
//         project.technologies &&
//         project.technologies.length
//       ) {
//         doc.text(
//           `Technologies: ${project.technologies.join(", ")}`
//         );
//       }

//       doc.moveDown();
//     });

//     // ==========================
//     // Education
//     // ==========================

//     doc
//       .fontSize(16)
//       .text("EDUCATION");

//     doc.moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .stroke();

//     doc.moveDown(0.5);

//     profile.education?.forEach(edu => {

//       doc
//         .fontSize(12)
//         .font("Helvetica-Bold")
//         .text(edu.degree || "");

//       doc
//         .font("Helvetica")
//         .fontSize(11)
//         .text(
//           `${edu.institution || ""} |   ${formatDate(edu.startDate) || ""} - ${
//           formatDate(edu.endDate) || ""
//         }`
//         );

//       // doc.text(
//       //   `${edu.startDate || ""} - ${
//       //     edu.endDate || ""
//       //   }`
//       // );

//       doc.moveDown();
//     });


//     if (
//   profile.certifications &&
//   profile.certifications.length > 0
// ) {

//   doc.moveDown();

//   doc
//       .fontSize(16)
//       .text("CERTIFICATIONS");

//       doc.moveTo(50, doc.y)
//       .lineTo(550, doc.y)
//       .stroke();
    
//       doc.moveDown(0.5);

//   profile.certifications.forEach(
//     (cert) => {

//       doc
//         .fontSize(11)
//         .font("Helvetica")
//         .text(`• ${cert}`);

//     }
//   );
// }

//     doc.end();

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       error: "Failed to generate resume"
//     });
//   }
// });


export default router;