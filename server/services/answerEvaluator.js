import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const evaluateAnswer = async (question, answer, profile) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  });

  const prompt = `
You are an expert technical interviewer.

Candidate Profile:
${JSON.stringify(profile)}

Interview Question:
"${question}"

Candidate Answer:
"${answer}"

Evaluate the answer and return JSON with:
- score (0-10)
- strengths (array)
- weaknesses (array)
- ideal_answer (string)
- improvement_tips (array)

Return only valid JSON.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};