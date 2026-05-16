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
  const [loading, setLoading] = useState(false);
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

var responseSaved = false;

// submit response
const handleSend = async () => {
  if (!input) return;

  const userAnswer = input;
  setcurrentAnswer(userAnswer);
  // show user message immediately
  setMessages((prev) => [...prev, { sender: "user", text: userAnswer }]);
  // clear input
    setInput("");
  setLoading(true);

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

    
    setcurrentAnswer(currentAnswer);
    setLoading(false);
  } catch (error) {
    console.error("Error:", error);
    setLoading(false);
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
    const response = await API.post("/session/add-response", {
      sessionId,
      question: currentQuestion,   // FIXED
      answer: userAnswer,
      evaluation: evalRes.data.evaluation
    });

    if (response.status === 200) {
      responseSaved = true;
    }
    } catch (error) {
      console.error("Evaluation Error:", error);
    }

}

// finish interview 
const handleEndInterview = async()=>{
    // save interview session data



    // navigate to evaluation page
   navigate("/evaluate"); 
  
}
  return (
   
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">

  <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-4">

    <h2 className="text-xl font-bold mb-4 text-center">
      AI Interview
    </h2>

    {/* Chat Box */}
    <div className="h-80 overflow-y-auto space-y-3 mb-4">

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-3 rounded-lg max-w-sm ${
            msg.sender === "ai"
              ? "bg-gray-200 text-left"
              : "bg-blue-500 text-white ml-auto"
          }`}
        >
          {msg.text}
        </div>
      ))}

    </div>

    {/* Input */}
    <div className="flex gap-2">
 
    </div>
      <div className="flex items-end gap-2 bg-white p-3 rounded-xl shadow-md">

  <textarea
   value={input}
     placeholder="Type your answer here..."
  onChange={(e) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }}
  rows={1}
  // className="flex-1 border p-2 rounded-lg resize-none overflow-y-auto max-h-40"
  className="flex-1 border px-4 py-2 rounded-2xl resize-none overflow-y-auto max-h-32 bg-gray-50 focus:ring-2 focus:ring-black-300"
   />

  <button
    onClick={handleSend}
     disabled={loading} 
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
  >
    Send
  </button>

</div>
    {/* End Button */}
    <button
      onClick={handleEndInterview}
      className="mt-4 min-w-full bg-red-500 text-white py-2 rounded-lg"
    >
      End Interview
    </button>

  </div>
</div>

  );
}

export default Interview;