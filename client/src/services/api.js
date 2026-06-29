import axios from "axios";
const API = axios.create({
  process.env.REACT_APP_API_URL ||
  baseURL: "http://localhost:5000/api"
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});



export default API;