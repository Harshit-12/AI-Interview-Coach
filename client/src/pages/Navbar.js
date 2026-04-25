import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    localStorage.removeItem("sessionId");

    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px",
      backgroundColor: "#222",
      color: "#fff"
    }}>
      
      <div>
        <h3>AI Interview Coach</h3>
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/dashboard" style={{ color: "#fff" }}>Home</Link>

        <Link to="/interview" style={{ color: "#fff" }}>
          Start Interview
        </Link>

        <Link to="/my-interviews" style={{ color: "#fff" }}>
          My Interviews
        </Link>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

    </div>
  );
}

export default Navbar;