import { Certificate } from "crypto";
import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true // 🔥 one profile per user
  },

  name: String,
  email: String,

  skills: [String],
  experience: [
  {
    role: String,
    company: String,
    description: String,
    startDate: String,
    endDate: String
  }
  ],
  education: [
    
    {
    degree: String,
    institution: String,
    startDate: String,
    endDate: String
    }
  ],
  projects: [
  {
    title: String,
    description: String,
    technologies: [String],
    liveUrl: String,
    startDate: String,
    endDate: String
  }
],
  contactNumber: String,
  githubUrl: String,
  linkedinUrl: String,
  certifications: [String],
  resumeText: String, // parsed PDF content

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("UserProfile", userProfileSchema);