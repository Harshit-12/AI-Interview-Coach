
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";

function Navbar() {
   const navigate = useNavigate();
   const handleLogout = () => {
     localStorage.clear();
     navigate("/");
   };

      const handleProtectedNavigation = (path) => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to access this page.");
      navigate("/login");
      return;
    }

    navigate(path);
  };
  return (
    <nav className="bg-gray-900 text-white shadow-sm border-b border-gray-200 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo Section */}
        <Link
         onClick={() => handleProtectedNavigation("/dashboard")}
          to="/dashboard"
          className="flex items-center gap-2 md:gap-3"
        >
          <img
            src={logo}
            alt="AI Coach Logo"
            className="
              h-8
              w-auto
              md:h-10
              object-contain
            "
          />

          
        </Link>

        {/* Right Side Menu */}
        <div className="flex items-center gap-3 md:gap-6">

          <Link
           onClick={() => handleProtectedNavigation("/dashboard")}
            to="/dashboard"
            className="
              text-blue-600
              hover:text-white
              text-sm
              md:text-base
              font-medium
              transition
            "
          >
            Dashboard
          </Link>

          <Link
           onClick={() => handleProtectedNavigation("/my-interviews")}
            to="/my-interviews"
            className="
              text-blue-600
              hover:text-white
              text-sm
              md:text-base
              font-medium
              transition
            "
          >
            Interviews
          </Link>

          <Link
          onClick={() => handleProtectedNavigation("/profile")}
            to="/profile"
            className="
              text-blue-600
              hover:text-white
              text-sm
              md:text-base
              font-medium
              transition
            "
          >
            Profile
          </Link>

        </div>
       {localStorage.getItem("token") && ( 
      <button
            onClick={handleLogout}
            className= "text-blue-600
              hover:text-white
              text-sm
              md:text-base
              font-medium
              transition"
          >
            Logout
          </button>)
}

        
      </div>
    </nav>
  );
}

export default Navbar;