import { useEffect, useState } from "react";
import API from "../services/api";

function Interview() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const profile = JSON.parse(localStorage.getItem("profile"));

  const survey = JSON.parse(localStorage.getItem("survey"));
  const sessionId = localStorage.getItem("sessionId");

  useEffect(() => {
    startInterview();
  }, []);

  // 🔥 Start Interview
  const startInterview = () => {
    const greeting = "Hi! 👋 Let's start your interview.\nTell me about yourself.";

    setMessages([
      { sender: "ai", text: greeting }
    ]);
      setCurrentQuestion(greeting); 
  };

  // 🔥 Handle User Answer
//   const handleSend = async () => {
//     if (!input) return;

//     const userMessage = { sender: "user", text: input };

//     setMessages((prev) => [...prev, userMessage]);

//     // 1️⃣ Evaluate answer
//     const evalRes = await API.post("/evaluation/evaluate", {
//       question: messages[messages.length - 1]?.text,
//       answer: input,
//       profile
//     });

//     // 2️⃣ Save to DB
//     await API.post("/session/add-response", {
//       sessionId,
//       question: messages[messages.length - 1]?.text,
//       answer: input,
//       evaluation: evalRes.data.evaluation
//     });

//     // 3️⃣ Generate next question
//     const qRes = await API.post("/startInterview", {
//       profile,
//       surveyAnswers
//     });

//     const nextQuestion = qRes.data.questions[0];
//     console.log(nextQuestion);
//     const aiMessage = { sender: "ai", text: nextQuestion };

//     setMessages((prev) => [...prev, aiMessage]);
//     setInput("");
//   };

const handleSend = async () => {
  if (!input) return;

  const userAnswer = input;

  // show user message immediately
  setMessages((prev) => [...prev, { sender: "user", text: userAnswer }]);

  try {
    console.log("Inside the handleSend");
    //  Evaluate answer
    const evalRes = await API.post("/evaluation/evaluate", {
      question: currentQuestion,   // ✅ FIXED
      answer: userAnswer,
      profile
    });

    // Save to DB
    await API.post("/session/add-response", {
      sessionId,
      question: currentQuestion,   // ✅ FIXED
      answer: userAnswer,
      evaluation: evalRes.data.evaluation
    });

    //  Generate next question
    console.log("before next question");
    // console.log("Survey :", surveyAnswers);
    const qRes = await API.post("/interview/startInterview", {
      profile,
      survey
    });
    console.log("Query Response : "+ qRes);
    const nextQuestion = qRes.data.questions?.[0];
    console.log("Next Question : "+ nextQuestion);
    if (!nextQuestion) {
      console.error("No question returned");
      return;
    }

    //  Add AI message
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: nextQuestion }
    ]);

    //  Update current question
    setCurrentQuestion(nextQuestion);

    // clear input
    setInput("");

  } catch (error) {
    console.error("Error:", error);
  }
};
  return (
    <div>
      <h2>AI Interview</h2>

      <div style={{ border: "1px solid gray", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "ai" ? "left" : "right" }}>
            <p><b>{msg.sender === "ai" ? "AI" : "You"}:</b> {msg.text}</p>
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your answer..."
      />

      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default Interview;