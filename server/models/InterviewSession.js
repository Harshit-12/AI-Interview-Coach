import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
  score: Number,
  strengths: [String],
  weaknesses: [String],
  ideal_answer: String,
  improvement_tips: [String]
});

const interviewHistorySchema = new mongoose.Schema({
  question: String,
  answer: String,
  evaluation: evaluationSchema
});

const surveySchema = new mongoose.Schema({
  question: String,
  answer: String
});

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: Object, ref: "User" }, // for future auth
    // Removed user profile fields since we will fetch from UserProfile model
    survey: [surveySchema],
    interviewHistory: [interviewHistorySchema]
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);