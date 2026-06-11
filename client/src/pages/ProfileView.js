import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ProfileView() {

  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");

      setProfile(res.data.profile);

    } catch (error) {
      console.error(error);
    }
  };

  const downloadResume = async () => {
  const response = await API.get(
    "/resume/generate",
    {
      responseType: "blob"
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;

  link.download = "resume.pdf";

  link.click();
};


  if (!profile) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg">

        {/* Header */}

        <div className="bg-blue-600 text-white p-8 rounded-t-xl">

          <h1 className="text-3xl font-bold">
            {profile.name}
          </h1>

          <p className="mt-2">
            {profile.targetRole}
          </p>

        </div>

        <div className="p-8">

          {/* Basic Info */}

          <section className="mb-8">

            <h2 className="text-xl font-bold mb-3">
              Basic Information
            </h2>

            <p>
              <strong>Email:</strong> {profile.email}
            </p>

          </section>

          {/* Skills */}

          <section className="mb-8">

            <h2 className="text-xl font-bold mb-3">
              Skills
            </h2>

            <div className="flex flex-wrap gap-2">

              {profile.skills?.map((skill, index) => (

                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>

              ))}

            </div>

          </section>

          {/* Experience */}

          <section className="mb-8">

            <h2 className="text-xl font-bold mb-3">
              Experience
            </h2>

            {profile.experience?.map((exp, index) => (

              <div
                key={index}
                className="border-l-4 border-blue-500 pl-4 mb-5"
              >

                <h3 className="font-semibold">
                  {exp.role}
                </h3>

                <p>
                  {exp.company}
                </p>

                <p className="text-sm text-gray-500">
                  {exp.startDate} - {exp.endDate}
                </p>

                <p className="mt-2">
                  {exp.description}
                </p>

              </div>

            ))}

          </section>

          {/* Education */}

          <section className="mb-8">

            <h2 className="text-xl font-bold mb-3">
              Education
            </h2>

            {profile.education?.map((edu, index) => (

              <div
                key={index}
                className="border-l-4 border-green-500 pl-4 mb-5"
              >

                <h3 className="font-semibold">
                  {edu.degree}
                </h3>

                <p>
                  {edu.institution}
                </p>

                <p className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </p>

              </div>

            ))}

          </section>

          {/* Projects */}

          <section className="mb-8">

            <h2 className="text-xl font-bold mb-3">
              Projects
            </h2>

            {profile.projects?.map((project, index) => (

              <div
                key={index}
                className="border rounded-lg p-4 mb-4"
              >

                <h3 className="font-semibold text-lg">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {project.startDate} - {project.endDate}
                </p>
                <p className="mt-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  {project.technologies?.map((tech, techIndex) => (

                    <span
                      key={techIndex}
                      className="bg-gray-200 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>

                  ))}

                </div>

              </div>

            ))}

          </section>

          {/* Edit Button */}

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={() => navigate("/profile/edit")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Update Profile
        </button>

        <button
          onClick={downloadResume}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Download Resume
        </button>
      </div>
           
          
        </div>
            
      </div>

    </div>
  );
}

export default ProfileView;