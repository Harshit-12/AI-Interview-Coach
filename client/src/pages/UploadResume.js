import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

        const res = await API.post("/resume/upload-resume", formData);
        console.log("Resume upload response: ", res.data);
        localStorage.setItem("sessionId", res.data.candidateProfile.userId);
        console.log("Session  id from resume upload: " + res.data.candidateProfile.userId);
      setLoading(false);
      navigate("/survey");

    } catch (error) {
      setLoading(false);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl text-center">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Your Resume 📄
        </h2>

        <p className="text-gray-500 mb-6">
          We’ll analyze your resume to personalize your interview
        </p>

        {/* Upload Box */}
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">

          <input
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <p className="text-gray-600">
            Click to upload or drag & drop
          </p>

          <p className="text-sm text-gray-400 mt-2">
            PDF only
          </p>

        </label>

        {/* File Name */}
        {file && (
          <p className="mt-4 text-green-600 text-sm">
            Selected: {file.name}
          </p>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing Resume..." : "Upload & Continue 🚀"}
        </button>

      </div>
          <div className="flex items-center w-full max-w-md">
    <hr className="flex-1" />
    <span className="mx-3 text-gray-500">
      OR
    </span>
    <hr className="flex-1" />
  </div>

  <button
    onClick={() => navigate("/profile/edit")}
    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
  >
    Create Your Resume from Scratch ✍️
  </button>
    </div>
  );
}

export default UploadResume;