import { useEffect, useState } from "react";
import API from "../services/api";
import {useNavigate} from "react-router-dom";

function Dashboard() {
  const [userName, setUserName] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async (req, res) => {
    const result = await API.get("/session/all");
    // const profile = await UserProfile.findOne({
    // userId: req.user.userId
    // });
    // console.log(result.data[0]);
    // setUserName(result.data[0].profile.name);
  };
    const handleStartInterview = async () => {
  try {
    // const res = await API.get("/session/check-profile");

    const res = await API.get("/profile/");

    const profile = res.data.profile;

    if (res.data.hasProfile) {
      // ✅ Use existing profile
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("sessionId", res.data.sessionId);
      console.log("Session  id : " + res.data.sessionId);
      navigate("/survey"); // or directly /interview if you want
    } else {
      // ❌ No profile → upload resume
      navigate("/upload");
    }

  } catch (error) {
    console.error(error);
  }
};


   const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    navigate("/"); // redirect to login
  };

  return (
    // <div>
    //   <h2>Welcome : 
    //     {" " + userName}
    //   </h2>
    //       <button onClick={handleLogout} style={{ float: "right" }}>
    //     Logout
    //   </button>
    //   <button onClick={handleStartInterview}>
    //   Start New Interview
    // </button>
    // </div>
     <div className="p-8 bg-gray-100 min-h-screen">

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome Back {userName ? ` ${userName}` : "My Friend"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold"> <button onClick={handleStartInterview} className="text-blue-600 hover:underline">
         Start New Interview
        </button></h3>
       
          <p className="text-gray-500">Practice AI-driven interviews</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">My Progress</h3>
          <p className="text-gray-500">Track your performance</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Resume Profile</h3>
          <p className="text-gray-500">Manage your profile</p>
        </div>

      </div>

    </div>
  )
}

export default Dashboard;