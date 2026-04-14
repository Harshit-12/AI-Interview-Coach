import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom"
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", {
        name,
        email,
        password
      });

      alert("Signup successful!");
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleSignup}>Signup</button>

      <p>
      Already have an account?{" "}
    <span
      onClick={() => navigate("/")}
      style={{ color: "blue", cursor: "pointer" }}
    >
    Login
  </span>
</p>
    </div>
  );
}

export default Signup;