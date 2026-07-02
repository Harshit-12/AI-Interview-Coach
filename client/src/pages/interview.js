import { useEffect, useState, useCallback  } from "react";
import API from "../services/api";
import {useNavigate} from "react-router-dom";
import { useRef } from "react";
function Interview() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  // const profile = JSON.parse(localStorage.getItem("profile"));
  const [currentAnswer, setcurrentAnswer] = useState("");
  const survey = JSON.parse(localStorage.getItem("survey"));
  const sessionId = localStorage.getItem("sessionId");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState();
  const [username, setuserName] = useState("");
  // const [isListening, setIsListening] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  useEffect(() => {
    const initializeInterview = async () => {
      const fetchedProfile = await fetchProfile();
      setProfile(fetchedProfile);
      startInterview();
    };
    initializeInterview();  
  }, []);



  useEffect(() => {
  if (currentQuestion) {
    speakQuestion(currentQuestion);
  }
}, [currentQuestion]);

useEffect(() => {
  bottomRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [messages]);
// const speakQuestion = (text) => {
//   speechSynthesis.cancel();

//   const utterance = new SpeechSynthesisUtterance(text);

//   utterance.lang = "en-IN";
//   utterance.rate = 0.9;
//   utterance.pitch = 1;
//   const voices = speechSynthesis.getVoices();

//   utterance.voice = voices[0];

//   speechSynthesis.speak(utterance);
// };

const speakQuestion = (text) => {
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  const voices = speechSynthesis.getVoices();
  console.log(voices);
  utterance.lang = "en-IN";
  utterance.rate = 0.9;
  utterance.pitch = 1.2;

  speechSynthesis.speak(utterance);
};

  //  Start Interview
  const startInterview = useCallback(async () => {
    const greeting =  `Hi ${username}! Let's start the interview.\nCould you please tell me about yourself.`;

    setMessages([
      { sender: "ai", text: greeting }
    ]);
      setCurrentQuestion(greeting); 
      setcurrentAnswer(currentAnswer);
  }, []);


const startRecording = async () => {

  const stream =
    await navigator.mediaDevices.getUserMedia({
      audio: true
    });

  const recorder =
    new MediaRecorder(stream);

  const chunks = [];

  recorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  recorder.onstop = async () => {

    const audioBlob =
      new Blob(chunks, {
        type: "audio/webm"
      });

    await transcribeAudio(audioBlob);
  };

  recorder.start();

  setRecorder(recorder);
};

const stopRecording = () => {

  if (recorder) {
    recorder.stop();
  };

};

const transcribeAudio = async (
  audioBlob
) => {

  try {

    const formData =
      new FormData();

    formData.append(
      "audio",
      audioBlob,
      "answer.webm"
    );

    const res =
      await API.post(
        "/speech/transcribe",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

    setAnswer(
      res.data.text
    );

    console.log("Answer:", res.data.text);
    setInput(input + res.data.text); 
  } catch (error) {

    console.error(error);

  }

};

// Fetch User Profile 

const fetchProfile = async () => {
  try {
    const res = await API.get("/profile");

    const profile = res.data.profile;
    setProfile(profile);
  
    setuserName(profile.name);
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
    
  } catch (error) {
    console.error("Error:", error);
    
  }
  finally
  {    
    setLoading(false);
  }

};

// const handleInputChange = (e) => {
//   setAnswer(e.target.value);

//   e.target.style.height = "auto";
//   e.target.style.height =
//     e.target.scrollHeight + "px";
// };

// const handleMicClick = () => {
//    const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;

//   const recognition = new SpeechRecognition();

//   recognition.continuous = false;
//   recognition.interimResults = true;
//   recognition.lang = "en-US";

//   if (!SpeechRecognition) {
//     alert("Speech Recognition not supported in this browser");
//     return;
//   }

//   setIsListening(true);
//   recognition.start();

//   recognition.onresult = (event) => {
//     var transcript = event.results[0][0].transcript;
//     console.log("Transcript: ", transcript);
//     console.log("Current Input before update: ", input);
//     // setInput((prev) => prev + " " + transcript); // append text
//     // transcript="";
 
//     setInput(input + " " + transcript); // replace text
//     setIsListening(false);
//     transcript="";
//   };

//   recognition.onerror = (err) => {
//     console.error(err);
//     setIsListening(false);
//   };

//   recognition.onend = () => {
//     setIsListening(false);
//   };
// };

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

const handleInputChange = (e) => {
  setInput(e.target.value);

  e.target.style.height = "auto";
  e.target.style.height = `${e.target.scrollHeight}px`;
};
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
          <button
        onClick={() => speakQuestion(currentQuestion)}
        className="bg-white-200 px-3 py-2 rounded-lg"
        >
        🔊
        </button>
        </div>
      ))}
          <div ref={bottomRef}></div>
    </div>
      
    {/* Input */}
    <div className="flex gap-2">
 
    </div>
      <div className="flex items-end gap-2 bg-white p-3 rounded-xl shadow-md">
<div className="w-full mt-6">

  {/* Text Area */}
  <textarea
    value={input}
    onChange={handleInputChange}
    placeholder="Type your response here or use voice input..."
    rows={4}
    className="
      w-full
      min-h-[100px]
      max-h-[300px]
      p-4
      border
      border-gray-300
      rounded-2xl
      shadow-sm
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      resize-none
      overflow-y-auto
      text-gray-700
      placeholder-gray-400
    "
  />

  {/* Buttons */}
  <div className="mt-4 flex flex-wrap gap-3 justify-center">

    <button
      onClick={startRecording}
      className="
        px-5
        py-2
        bg-green-500
        hover:bg-green-600
        text-white
        rounded-xl
        transition
      "
    >
      🎤 Speak
    </button>

    <button
      onClick={stopRecording}
      className="
        px-5
        py-2
        bg-red-500
        hover:bg-red-600
        text-white
        rounded-xl
        transition
      "
    >
      ⏹ Stop
    </button>

    <button
      onClick={handleSend}
      className="
        px-5
        py-2
        bg-blue-600
        hover:bg-blue-700
        text-white
        rounded-xl
        transition
      "
    >
      📤 Send Response
    </button>

  </div>

</div>
  {/* <textarea
   value={input}
     placeholder={loading ? "AI is thinking, please wait..." : "Type your answer here..."}
     disabled={loading} 
  onChange={(e) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }}
  rows={1}
  // className="flex-1 border p-2 rounded-lg resize-none overflow-y-auto max-h-40"
  className="flex-1 border px-4 py-2 rounded-2xl resize-none overflow-y-auto max-h-32 bg-gray-50 focus:ring-2 focus:ring-black-300"
  rows={4}
  className="
    w-full
    min-h-[100px]
    max-h-[300px]
    resize-none
    overflow-y-auto
    rounded-2xl
    border
    border-gray-300
    px-4
    py-3
    text-gray-800
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-blue-500
    shadow-sm
   /> */}


{/* <textarea
  value={input}
  // onChange={handleInputChange}
  rows={4}
   placeholder={loading ? "AI is thinking, please wait..." : "Type your answer here..."}
     disabled={loading} 
  onChange={(e) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }}
  className="
    w-full
    min-h-[100px]
    max-h-[300px]
    resize-none
    overflow-y-auto
    rounded-2xl
    border
    border-gray-300
    px-4
    py-3
    text-gray-800
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-blue-500
    shadow-sm
  "
/>
  {/* 🎤 Mic Button */}
  {/* <button
    onClick={handleMicClick}
    disabled={loading}
    className={`px-3 py-2 rounded-full ${
      isListening ? "bg-green-400" : "bg-gray-200"
    }`}
  >
    🎤
  </button> */}

  {/* <div className="flex gap-3">

  <button
    onClick={startRecording}
    className="
      bg-green-600
      text-white
      px-4
      py-2
      rounded-lg
    "
  
  >
    🎤 Speak
  </button>

  <button
    onClick={stopRecording}
    className="
      bg-red-600
      text-white
      px-4
      py-2
      rounded-lg
    "
  >
    ⏹ Stop
  </button>

</div>

  <button
    onClick={handleSend}
     
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    disabled={loading} 
  >
    Send Response
  </button> */}

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