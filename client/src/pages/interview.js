import { useEffect, useState } from "react";
import API from "../services/api";
import {useNavigate} from "react-router-dom";

function Interview() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  // const profile = JSON.parse(localStorage.getItem("profile"));
  const [currentAnswer, setcurrentAnswer] = useState("");
  const survey = JSON.parse(localStorage.getItem("survey"));
  const sessionId = localStorage.getItem("sessionId");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const initializeInterview = async () => {
      const fetchedProfile = await fetchProfile();
      setProfile(fetchedProfile);
      startInterview();
    };
    initializeInterview();  
  }, []);




  //  Start Interview
  const startInterview = () => {
    const greeting = "Hi! Let's start the interview.\nCould you please tell me about yourself.";

    setMessages([
      { sender: "ai", text: greeting }
    ]);
      setCurrentQuestion(greeting); 
      setcurrentAnswer(currentAnswer);
  };



// finish interview 
const handleEndInterview = async()=>{
   navigate("/evaluate"); 
}

// Fetch User Profile 

const fetchProfile = async () => {
  try {
    const res = await API.get("/profile");

    const profile = res.data.profile;
    setProfile(profile);
    // optional: store temporarily
    localStorage.setItem("profile", JSON.stringify(profile));

    return profile;

  } catch (error) {
    console.error(error);
    return null;
  }
};


// submit response
const handleSend = async () => {
  if (!input) return;

  const userAnswer = input;
  setcurrentAnswer(userAnswer);
  // show user message immediately
  setMessages((prev) => [...prev, { sender: "user", text: userAnswer }]);

  try {
    console.log("Inside the handleSend");
    //  Evaluate answer
    // const evalRes = await API.post("/evaluation/evaluate", {
    //   question: currentQuestion,   // 
    //   answer: userAnswer,
    //   profile
    // });

    // // Save to DB
    // await API.post("/session/add-response", {
    //   sessionId,
    //   question: currentQuestion,   // FIXED
    //   answer: userAnswer,
    //   evaluation: evalRes.data.evaluation
    // });

 
    const evaluation = await handleEvaluation(userAnswer, profile);

    //  Generate next question
    console.log("before next question");
    // console.log("Survey :", surveyAnswers);
    const qRes = await API.post("/interview/startInterview", {
      profile,
      survey,
      previousQuestion: currentQuestion,
      previousAnswer: userAnswer
    });

    console.log("Evaluation Result : "+ evaluation);
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
    setcurrentAnswer(currentAnswer);
  } catch (error) {
    console.error("Error:", error);
  }
};


// Evaluate answer and save to DB
const handleEvaluation = async (userAnswer, profile) => {
  try {
      const evalRes = await API.post("/evaluation/evaluate", {
      question: currentQuestion,   // 
      answer: userAnswer,
      profile
    });

    console.log("current Answers before add response " + userAnswer);
    // Save to DB
     await API.post("/session/add-response", {
      sessionId,
      question: currentQuestion,   // FIXED
      answer: userAnswer,
      evaluation: evalRes.data.evaluation
    });
    } catch (error) {
      console.error("Evaluation Error:", error);
    }

}
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
      <button onClick={handleEndInterview} style={{ marginLeft: "50px", marginTop: "20px" }}>
        End Interview
      </button>
    </div>
  );
}

export default Interview;