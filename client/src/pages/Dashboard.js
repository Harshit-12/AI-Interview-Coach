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
    // const res = await API.get("/session/all");
    // const profile = await UserProfile.findOne({
    // userId: req.user.userId
    // });
    // console.log(res.data[0]);
    // setUserName(res.data[0].profile.name);
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
    <div>
      <h2>Welcome : 
        {" " + userName}
      </h2>
          <button onClick={handleLogout} style={{ float: "right" }}>
        Logout
      </button>
      <button onClick={handleStartInterview}>
      Start New Interview
    </button>
    </div>
  )
}

export default Dashboard;