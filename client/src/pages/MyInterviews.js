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
      console.log("Fetched sessions:", res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewSession = (sessionId) => {
    navigate(`/evaluation/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Your Interview History
      </h2>

      {sessions?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {sessions.filter(
          (session) => session.interviewHistory?.length > 0).map((session) => (
            
            <div
              key={session._id}
              onClick={() => handleViewSession(session._id)}
              className="
                bg-white
                rounded-xl
                shadow-md
                hover:shadow-xl
                transition
                p-5
                cursor-pointer
                border
                border-gray-100
              "
            >


              <div className="mt-4 space-y-3 text-sm">

                <div className="flex items-center">
                  <span className="w-28 text-gray-500 font-medium">
                    📅 Date
                  </span>

                  <span className="text-gray-800">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="w-28 text-gray-500 font-medium">
                    🎯 Target Role
                  </span>

                  <span className="text-gray-800">
                    {session.survey?.[0]?.role || "N/A"}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="w-28 text-gray-500 font-medium">
                    ⚡ Difficulty
                  </span>

                  <span className="
      px-2
      py-1
      rounded-full
      bg-green-100
      text-green-700
      text-xs
      font-medium
    ">
                    {session.survey?.[0]?.difficulty || "N/A"}
                  </span>
                </div>

              

              <div className="flex items-center">
                <span className="w-28 text-gray-500 font-medium">
                  🛠️ Tech Stack
                </span>

                <div className="flex flex-wrap gap-2">
                  {session.survey?.[0]?.techStack?.length > 0 ? (
                    session.survey[0].techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="
            px-2
            py-1
            rounded-full
            bg-purple-100
            text-purple-700
            text-xs
            font-medium
          "
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-800">N/A</span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <span className="w-28 text-gray-500 font-medium">
                  ❓ Questions
                </span>

                <span className="
    px-2
    py-1
    rounded-full
    bg-blue-100
    text-blue-700
    text-xs
    font-medium
  ">
                  {session.interviewHistory?.length || 0}
                </span>
              </div>
              </div>


              <button
                className="
                  mt-4
                  w-full
                  bg-blue-600
                  text-white
                  py-2
                  rounded-lg
                  hover:bg-blue-700
                "
              >
                View Evaluation
              </button>

            </div>
                
                
          ))}
        
        </div>
      ) : (

        <div className="text-center py-16">

          <h3 className="text-xl font-semibold text-gray-700">
            No Interviews Yet
          </h3>

          <p className="text-gray-500 mt-2">
            Start your first AI interview to see history here.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="
              mt-4
              bg-blue-600
              text-white
              px-6
              py-3
              rounded-lg
              hover:bg-blue-700
            "
          >
            Start Interview
          </button>

        </div>

      )}

    </div>
  );
}

export default MyInterviews;