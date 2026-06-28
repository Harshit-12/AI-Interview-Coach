import express from "express";
import multer from "multer";
import fs from "fs";
import Groq from "groq-sdk";
import path from "path";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage
});

// const upload = multer({
//   dest: "uploads/"
// });

router.post(
  "/transcribe",
  upload.single("audio"),
  async (req, res) => {

    try {
        console.log("req.file:", req.file);
        
      const transcription =
        await groq.audio.transcriptions.create({
          file: fs.createReadStream(
            req.file.path
          ),
          model:
            "whisper-large-v3-turbo",
          language: "en"
        });

      fs.unlinkSync(req.file.path);

      res.json({
        text: transcription.text
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: "Transcription failed"
      });

    }

  }
);

export default router;