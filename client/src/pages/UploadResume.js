import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
function UploadResume() {
  const [file, setFile] = useState(null);
  const [profile, setProfile] = useState(null);
   const navigate = useNavigate();
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await API.post("/resume/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log(res.data);

      setProfile(res.data.candidateProfile);

      // store profile for next steps
      localStorage.setItem(
        "profile",
        JSON.stringify(res.data.candidateProfile)
      );

      navigate("/survey");

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>Upload</button>

     { /* Show Extracted Profile */}
      {profile && (
        <div>
          <h3>Extracted Profile</h3>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}


    </div>
  );
}

export default UploadResume;