import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


function MyInterviews() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/session/all");
      setSessions(res.data);
      console.log("Fetched sessions: ", res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 Navigate to evaluation page
  const handleViewSession = (sessionId) => {
    navigate(`/evaluation/${sessionId}`);
  };
    
//   var avgScore =0;
//   if (sessions.length > 0) {
//        avgScore=  sessions.map(session => session.interviewHistory.evaluation).flat().reduce((acc, item) => acc + (item?.score || 0), 0) /
//       sessions.length;
//     }
    
      
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center p-4">Your Interview History</h2>

  

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        
        {sessions?.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              onClick={() => handleViewSession(session._id)}
              style={{
                bgColor: "blue-50 hover:bg-blue-100",
                border: "0px solid gray",
                padding: "15px",
                marginLeft: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                hover: "bg-blue-100 color: blue-700",
                width: "450px",
                cursor: "pointer",
                borderRadius: "10px"
              }}
            >
              <h3>Interview</h3>

              <p><b>Date:</b> {new Date(session.createdAt).toLocaleString()}</p>

              <p><b>Questions:</b> {session.interviewHistory.length}</p>

              {/* Optional: show role */}
              <p><b>Role:</b> {session.survey?.[0]?.answer || "N/A"}</p>

              {/*Show avg score if available*/}
              {/* <p><b>Avg Score:</b> {avgScore.toFixed(1)}</p> */}
              
            </div>
          ))
        ) : (
          <p>No interviews yet</p>
        )}

      </div>
    </div>
  );
}

export default MyInterviews;