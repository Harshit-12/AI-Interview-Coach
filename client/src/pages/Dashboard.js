import { useEffect, useState } from "react";
import API from "../services/api";
import {Link, useNavigate} from "react-router-dom";

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function Dashboard() {
 const [userName, setUserName] = useState("");
const [profileCompletion, setProfileCompletion] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/profile/");
      const profile = res.data.profile;
      setUserName(profile?.name || "");


    const fields = [
      profile?.name,
      profile?.email,
      profile?.skills?.length > 0,
      profile?.experience?.length > 0,
      profile?.education?.length > 0,
      profile?.projects?.length > 0,
      profile?.linkedinUrl,
      profile?.githubUrl
    ];

    const completed =
      fields.filter(Boolean).length;

    setProfileCompletion(
      Math.round(
        (completed / fields.length) * 100
  )
);
    } catch (error) {
      console.error(error);
    }
  };
    const handleStartInterview = async () => {
  try {
    // const res = await API.get("/session/check-profile");
    
    const res = await API.get("/profile/");

    console.log("Profile check response: ", res.data);

    const profile = res.data.profile;

    if (res.data.hasProfile) {
      // ✅ Use existing profile
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("sessionId", res.data.profile.userId);
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
   
  <div className="min-h-screen bg-gray-100 p-6">
  
  <div className="
  bg-gradient-to-r
  from-blue-600
  to-indigo-600
  text-white
  rounded-2xl
  p-6
  shadow-lg
">

  <div className="flex justify-between items-center">

    <div>

      <h1 className="text-3xl font-bold">
        Welcome Back, {userName}
      </h1>

      <p className="mt-2 text-blue-100">
        Ready for your next AI interview?
      </p>
  
    </div>
   {/* <div className="text-center text-sm text-blue-100">
  
</div> */}
    <div className="w-20 text-center text-sm text-blue-100">

      <CircularProgressbar
        value={profileCompletion}
        text={`${profileCompletion}%`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: "#ffffff",
          trailColor: "rgba(255,255,255,0.2)"
        })}
      />
      <div className="mt-2 text-xs">
        Profile Completion
      </div>
    </div>
  

  </div>



    {/* Welcome Banner */}

    {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-lg">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Welcome Back {userName ? ` ${userName}` : ""}
          </h1>

          <p className="mt-2 text-blue-100">
            Ready for your next AI interview?
          </p>
        </div>

        {/* <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Logout
        </button> */}

      {/* </div> */}


    </div>

    {/* Profile Completion */}



    {/* Quick Actions */}

    <h2 className="text-2xl font-bold mt-8 mb-4">
      Quick Actions
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div
        onClick={handleStartInterview}
        className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <h3 className="text-lg font-semibold text-blue-600">
          ▶ Start Interview
        </h3>

        <p className="text-gray-500 mt-2">
          Begin a new AI interview session
        </p>
      </div>

      <Link
        to="/profile"
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <h3 className="text-lg font-semibold text-green-600">
          👤 My Profile
        </h3>

        <p className="text-gray-500 mt-2">
          View and update your profile
        </p>
      </Link>

      <Link
        to="/upload"
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <h3 className="text-lg font-semibold text-purple-600">
          📄 Update Resume
        </h3>

        <p className="text-gray-500 mt-2">
          Upload latest resume
        </p>
      </Link>

      <Link
        to="/profile"
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <h3 className="text-lg font-semibold text-orange-600">
          📥 Resume Builder
        </h3>

        <p className="text-gray-500 mt-2">
          Generate ATS friendly resume
        </p>
      </Link>

    </div>


<h2 className="text-2xl font-bold mt-8 mb-4">
      Interview Insights
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Link to="/my-interviews">
      
      <div
       
        className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <h3 className="text-lg font-semibold text-blue-600">
          📊  Recent Interviews 
        </h3>

        <p className="text-gray-500 mt-2">
           Track interview trends and scores.
        </p>
      </div>
      </Link>
      <Link
        to="/profile"
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <h3 className="text-lg font-semibold text-green-600">
          📈 Performance Insights
        </h3>

        <p className="text-gray-500 mt-2">
           Analyze strengths and weaknesses.
        </p>
      </Link>

      <Link
        to="/upload"
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
      >
        <h3 className="text-lg font-semibold text-purple-600">
          🎯 AI Career Coach
        </h3>

        <p className="text-gray-500 mt-2">
           Personalized career recommendations.
        </p>
      </Link>

     

    </div>



   

  </div>
);
}

export default Dashboard;