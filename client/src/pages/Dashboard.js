import { useEffect, useState } from "react";
import API from "../services/api";
import {useNavigate} from "react-router-dom";


function Dashboard() {
  const [userName, setUserName] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const res = await API.get("/session/all");
    console.log(res.data[0]);
    setUserName(res.data[0].profile.name);
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
      <button onClick={() => navigate("/upload")} style={{float:"center"}}>
  Start New Interview
    </button>
    </div>
  )
}

export default Dashboard;