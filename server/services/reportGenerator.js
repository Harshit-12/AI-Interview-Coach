import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInterviewReport = async (
  profile,
  surveyAnswers,
  interviewHistory
) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
You are an expert interview coach.

Candidate Profile:
${JSON.stringify(profile)}

Survey Answers:
${JSON.stringify(surveyAnswers)}

Interview History (Questions, Answers, Evaluations):
${JSON.stringify(interviewHistory)}

Generate a detailed interview performance report in JSON with:
- overall_score (0-10)
- strengths_summary (array)
- weaknesses_summary (array)
- topic_performance (object: topic -> score)
- role_readiness (string analysis)
- improvement_roadmap (array of steps)
- final_feedback (string)

Return only valid JSON.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};