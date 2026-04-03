import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateInterviewQuestions = async (profile, surveyAnswers, previousQuestion, previousAnswer) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = `
You are a friendly human interviewer.

Candidate Profile:
${JSON.stringify(profile)}

Survey Answers:
${JSON.stringify(surveyAnswers)}

Previous Question:
${JSON.stringify(previousQuestion)}

Previous Answer:
${JSON.stringify(previousAnswer)}

Generate 5 personalized interview questions:
- Mix technical + behavioral
- Ask conversationally like a real interviewer
- Adapt questions to candidate skills and target role
- Ask only ONE question at a time
- Ask follow-up questions based on candidate’s previous answer if it is needed
- Do NOT generate multiple questions at once
- Return JSON array only

Example:
[
  "Tell me about project you worked on so far.",
  "How have you used XYZ technology in real-world scenarios?",
  "Why do you think you are suitable candidate for this job role?"
]
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  console.log("Interview Questions: "+ JSON.stringify(response));
  return response.text();
};