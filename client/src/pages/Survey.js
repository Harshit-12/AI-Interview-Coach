import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Survey() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "",
    companies: "",
    experience: "",
    interviewType: "",
    difficulty: "",
    strengths: "",
    weaknesses: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const profile = JSON.parse(localStorage.getItem("profile"));

      if (!profile) {
        alert("No profile found. Please upload resume first.");
        return;
      }

      // convert to required format
      const survey = [
        { question: "Target Role", answer: form.role },
        { question: "Target Companies", answer: form.companies },
        { question: "Experience", answer: form.experience },
        { question: "Interview Type", answer: form.interviewType },
        { question: "Difficulty", answer: form.difficulty },
        { question: "Strengths", answer: form.strengths },
        { question: "Weaknesses", answer: form.weaknesses }
      ];

      //  create session in DB
      const res = await API.post("/session/create", {
        profile,
        survey
      });

      const sessionId = res.data.sessionId;

      // store sessionId for interview
      localStorage.setItem("sessionId", sessionId);

      // navigate to interview page
      navigate("/interview");

    } catch (error) {
      console.error(error);
      alert("Failed to create session");
    }
  };

  return (
    <div>
      <h2>Interview Setup</h2>

      <input name="role" placeholder="Target Role" onChange={handleChange} />
      <input name="companies" placeholder="Target Companies" onChange={handleChange} />
      <input name="experience" placeholder="Experience (e.g., 2 years)" onChange={handleChange} />

      <select name="interviewType" onChange={handleChange}>
        <option value="">Select Interview Type</option>
        <option value="Technical">Technical</option>
        <option value="HR">HR</option>
        <option value="Mixed">Mixed</option>
      </select>

      <select name="difficulty" onChange={handleChange}>
        <option value="">Select Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <input name="strengths" placeholder="Your strengths" onChange={handleChange} />
      <input name="weaknesses" placeholder="Topics to improve" onChange={handleChange} />

      <button onClick={handleSubmit}>Start Interview</button>
    </div>
  );
}

export default Survey;