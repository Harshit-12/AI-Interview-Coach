import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import Survey from "./pages/Survey";
import Interview from "./pages/interview";
import Evaluation from "./pages/Evaluation";
import MyInterviews from "./pages/MyInterviews";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/interview" element={<Interview/>} />
        <Route path="/evaluation/:sessionId" element={<Evaluation />} />
        <Route path="/my-interviews" element={<MyInterviews />} />
      </Routes>
    </Router>
  );
}

export default App;