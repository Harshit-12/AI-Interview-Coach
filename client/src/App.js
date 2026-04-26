import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import Survey from "./pages/Survey";
import Interview from "./pages/interview";
import Evaluation from "./pages/Evaluation";
import MyInterviews from "./pages/MyInterviews";
import Evaluate from "./pages/Evaluate";
import Navbar from "./components/Navbar";
function App() {
  const token = localStorage.getItem("token");
  return (
    <>
    <Router>
     <Navbar/>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadResume />
          </ProtectedRoute>
        } />
        <Route path="/survey" element={
          <ProtectedRoute>
            <Survey />
          </ProtectedRoute>
        } />
        <Route path="/interview" element={
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        } />
        <Route path="/evaluate" element={
          <ProtectedRoute>
            <Evaluate />
          </ProtectedRoute>
        } />
        <Route path="/evaluation/:sessionId" element={
          <ProtectedRoute>
            <Evaluation />
          </ProtectedRoute>
        } />
        <Route path="/my-interviews" element={
          <ProtectedRoute>
            <MyInterviews />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
    </>
  );

}

export default App;