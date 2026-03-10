import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const gemin_key = process.env.GEMINI_API_KEY;
console.log("Gem Key: "+  gemin_key);
export const extractCandidateProfile = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
You are an expert technical recruiter AI.

From the following resume text, extract a structured JSON profile with:
- name
- skills (array)
- experience summary
- projects (array)
- target_roles (array)
- strengths (array)

Return only valid JSON.

Resume Text:
${resumeText}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini profile extraction error:", error);
    throw error;
  }
};