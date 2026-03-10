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
    userId: { type: String, default: null }, // for future auth
    profile: Object, // extracted profile
    survey: [surveySchema],
    interviewHistory: [interviewHistorySchema]
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);