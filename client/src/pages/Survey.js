import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Survey() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    techStack: "",
    difficulty: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("survey", JSON.stringify(formData));

    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Customize Your Interview 🎯
        </h2>

        <p className="text-gray-500 mb-6">
          Help us tailor questions based on your goals
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Target Role */}
          <div>
            <label className="block text-gray-700 mb-1">
              Target Role
            </label>
            <input
              type="text"
              name="role"
              placeholder="e.g. Frontend Developer"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select</option>
              <option>Fresher</option>
              <option>1-2 Years</option>
              <option>3-5 Years</option>
              <option>5+ Years</option>
            </select>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-gray-700 mb-1">
              Tech Stack
            </label>
            <input
              type="text"
              name="techStack"
              placeholder="e.g. React, Node.js, MongoDB"
              value={formData.techStack}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-gray-700 mb-1">
              Interview Difficulty
            </label>
            <div className="flex gap-4">

              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() =>
                    setFormData({ ...formData, difficulty: level })
                  }
                  className={`px-4 py-2 rounded-lg border ${
                    formData.difficulty === level
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {level}
                </button>
              ))}

            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Start Interview 🚀
          </button>

        </form>

      </div>

    </div>
  );
}

export default Survey;