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
  experience: String,
  education: String,
  projects: [String],

  resumeText: String, // parsed PDF content

  targetRole: String,
  preferredDomains: [String],

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