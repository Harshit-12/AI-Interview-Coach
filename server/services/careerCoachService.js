import InterviewSession from "../models/InterviewSession.js";
import CareerCoach from "../models/CareerCoach.js";
import { buildCareerCoachPrompt } from "../utils/prompts.js";


// Import your existing Gemini model
// Change this import if your file is different
// import model from "../config/gemini.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-3-flash-preview"});


/**
 * Build optimized interview history for AI
 */
const buildInterviewHistory = (sessions) => {

    return sessions
        .filter(session => session.interviewHistory?.length > 0)
        .map(session => {

            const totalScore = session.interviewHistory.reduce(
                (sum, q) => sum + (Number(q.evaluation?.score) || 0),
                0
            );

            const avgScore =
                totalScore / session.interviewHistory.length;

            return {

                interviewDate: session.createdAt,

                role:
                    session.survey?.[0]?.role ||
                    "Not Specified",

                difficulty:
                    session.survey?.[0]?.difficulty ||
                    "Not Specified",

                experience:
                    session.survey?.[0]?.experience ||
                    "Not Specified",

                techStack:
                    session.survey?.[0]?.techStack || [],

                averageScore:
                    Number(avgScore.toFixed(2)),

                questions:
                    session.interviewHistory.map(item => ({

                        question:
                            item.question,

                        score:
                            item.evaluation?.score,

                        strengths:
                            item.evaluation?.strengths,

                        weaknesses:
                            item.evaluation?.weaknesses,

                        tips:
                            item.evaluation?.tips

                    }))

            };

        });

};

/**
 * Remove markdown if Gemini wraps JSON
 */
const cleanJson = (text) => {

    return text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

};

/**
 * Generate AI Career Coach Report
 */
export const generateCareerCoachReport = async (userId) => {

    try {

        const sessions =
            await InterviewSession.find({
                userId
            }).sort({
                createdAt: 1
            });

        if (!sessions.length) {

            throw new Error(
                "No interview sessions found."
            );

        }

        const interviewHistory =
            buildInterviewHistory(sessions);

        const prompt =
            buildCareerCoachPrompt(
                interviewHistory
            );

        console.log(
            "Generating Career Coach Report..."
        );

        //--------------------------------------------------
        // Gemini
        //--------------------------------------------------

        const result =
            await model.generateContent(prompt);

        const response =
            await result.response;

        const text =
            response.text();

        console.log(
            "Career Coach Response Received"
        );

        //--------------------------------------------------
        // Parse JSON
        //--------------------------------------------------

        let aiReport;

        try {

            aiReport =
                JSON.parse(
                    cleanJson(text)
                );

        } catch (error) {

            console.error(
                "Gemini returned invalid JSON"
            );

            console.error(text);

            throw new Error(
                "Failed to parse Gemini JSON response."
            );

        }

        //--------------------------------------------------
        // Save Report
        //--------------------------------------------------

        const savedReport =
            await CareerCoach.findOneAndUpdate(

                {
                    userId
                },

                {

                    userId,

                    candidateSummary:
                        aiReport.candidateSummary,

                    interviewReadiness:
                        aiReport.interviewReadiness,

                    overallStrengths:
                        aiReport.overallStrengths,

                    overallWeaknesses:
                        aiReport.overallWeaknesses,

                    technicalAreasToImprove:
                        aiReport.technicalAreasToImprove,

                    softSkillsToImprove:
                        aiReport.softSkillsToImprove,

                    knowledgeGaps:
                        aiReport.knowledgeGaps,

                    careerAdvice:
                        aiReport.careerAdvice,

                    motivationalMessage:
                        aiReport.motivationalMessage,

                    nextInterviewFocus:
                        aiReport.nextInterviewFocus,

                    recommendedResources:
                        aiReport.recommendedResources,

                    weeklyStudyPlan:
                        aiReport.weeklyStudyPlan

                },

                {

                    upsert: true,

                    new: true

                }

            );

        return savedReport;

    }

    catch (error) {

        console.error(
            "Career Coach Error:",
            error
        );

        throw error;

    }

};

/**
 * Fetch Saved Career Coach Report
 */
export const getCareerCoachReport = async (userId) => {

    return await CareerCoach.findOne({
        userId
    });

};