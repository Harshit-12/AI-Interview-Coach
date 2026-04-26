import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">

      <h1 className="text-xl font-bold text-blue-400">
        AI Interview Coach
      </h1>
      
      <div className="flex gap-6 items-center">

        <Link to="/dashboard" className="hover:text-blue-400">
          Home
        </Link>

        <Link to="/my-interviews" className="hover:text-blue-400">
          My Interviews
        </Link>

        <button
          onClick={() => navigate("/interview")}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Start Interview
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;