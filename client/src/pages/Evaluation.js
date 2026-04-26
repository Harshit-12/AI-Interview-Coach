import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams} from "react-router-dom";
function Evaluation() {
  const [session, setSession] = useState(null);

//   const sessionId = localStorage.getItem("sessionId");
    const {sessionId} = useParams();
   
  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await API.get(`/session/${sessionId}`);
      console.log("sessssion data "  + JSON.stringify(res.data));
      setSession(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!session) return <p>Loading...</p>;

  return (
    // <div>
    //   <h2>Interview Evaluation Report</h2>

    //   {session.interviewHistory.map((item, index) => (
    //     <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          
    //       <h3>Q{index + 1}: {item.question}</h3>

    //       <p><b>Your Answer:</b> {item.answer}</p>

    //       <p><b>Score:</b> {item.evaluation?.score}</p>

    //       <p><b>Strengths:</b></p>
    //       <ul>
    //         {item.evaluation?.strengths?.map((s, i) => (
    //           <li key={i}>{s}</li>
    //         ))}
    //       </ul>

    //       <p><b>Weaknesses:</b></p>
    //       <ul>
    //         {item.evaluation?.weaknesses?.map((w, i) => (
    //           <li key={i}>{w}</li>
    //         ))}
    //       </ul>

    //       <p><b>Ideal Answer:</b></p>
    //       <p>{item.evaluation?.ideal_answer}</p>

    //       <p><b>Improvement Tips:</b></p>
    //       <ul>
    //         {item.evaluation?.improvement_tips?.map((tip, i) => (
    //           <li key={i}>{tip}</li>
    //         ))}
    //       </ul>

    //     </div>
    //   ))}
    // </div>
    <div className="p-8 bg-gray-100 min-h-screen">

  <h2 className="text-2xl font-bold mb-6">
    Interview Report 📊
  </h2>

  {session.interviewHistory.map((item, i) => (
    <div key={i} className="bg-white p-6 rounded-xl shadow mb-4">

      <h3 className="font-semibold text-lg">
        Q{i + 1}: {item.question}
      </h3>

      <p className="mt-2"><b>Your Answer:</b> {item.answer}</p>
      <p><b>Score:</b> {item.evaluation.score}</p>

      <div className="mt-2">
        <b>Strengths:</b>
        <ul className="list-disc ml-5">
          {item.evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

    <div className="mt-2">
        <b>Weaknesses:</b>
        <ul className="list-disc ml-5">
          {item.evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </div>

      <p><b>Ideal Answer:</b> {item.evaluation.ideal_answer}</p>

       <div className="mt-2">
        <b>Improvement Tips:</b>
        <ul className="list-disc ml-5">
          {item.evaluation.improvement_tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>

    </div>
  ))}

</div>
  );
}

export default Evaluation;