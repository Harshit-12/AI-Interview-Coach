import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }
// logut user if token expired
if (token) {
  const decoded = jwtDecode(token);

  if (decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }
}
  return children;
}

export default ProtectedRoute;