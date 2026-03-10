import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInterviewQuestions = async (profile, surveyAnswers) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
You are a friendly human interviewer.

Candidate Profile:
${JSON.stringify(profile)}

Survey Answers:
${JSON.stringify(surveyAnswers)}

Generate 5 personalized interview questions:
- Mix technical + behavioral
- Ask conversationally like a real interviewer
- Adapt questions to candidate skills and target role
- Return JSON array only

Example:
[
  "Tell me about your MERN stack project.",
  "How have you used Azure AI in real-world scenarios?"
]
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};