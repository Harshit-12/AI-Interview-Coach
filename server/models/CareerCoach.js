import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    topic: String,
    resourceName: String,
    resourceType: String,
    url: String,
    reason: String,
  },
  { _id: false }
);

const StudyPlanSchema = new mongoose.Schema(
  {
    week: Number,
    focus: String,
    tasks: [String],
  },
  { _id: false }
);

const CareerCoachSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    candidateSummary: String,

    interviewReadiness: {
      score: Number,
      level: String,
    },

    overallStrengths: [String],

    overallWeaknesses: [String],

    technicalAreasToImprove: [String],

    softSkillsToImprove: [String],

    knowledgeGaps: [String],

    careerAdvice: String,

    motivationalMessage: String,

    nextInterviewFocus: [String],

    recommendedResources: [ResourceSchema],

    weeklyStudyPlan: [StudyPlanSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "CareerCoach",
  CareerCoachSchema
);