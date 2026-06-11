import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    skills: "",
    experience: [],
    education: [],
    projects: []
  });

  const [loading, setLoading] = useState(false);

  // fetch profile
  useEffect(() => {
    fetchProfile();
  }, []);




const addExperience = () => {
  setProfile({
    ...profile,
    experience: [
      ...profile.experience,
      {
        role: "",
        company: "",
        description: "",
        startDate: "",
        endDate: ""
      }
    ]
  });
};

const removeExperience = (index) => {
  const updatedExperience =
    profile.experience.filter(
      (_, i) => i !== index
    );

  setProfile({
    ...profile,
    experience: updatedExperience
  });
};


  const handleExperienceChange = (
  index,
  field,
  value
) => {
  const updatedExperience = [...profile.experience];

  updatedExperience[index][field] = value;

  setProfile({
    ...profile,
    experience: updatedExperience
  });
};


const addEducation = () => {
  setProfile({
    ...profile,
    education: [
      ...profile.education,
      {
        degree: "",
        institution: "",
        description: "",
        startDate: "",
        endDate: ""
        
      }
    ]
  });
};


const removeEducation = (index) => {
  const updatedEducation =
    profile.education.filter(
      (_, i) => i !== index
    );

  setProfile({
    ...profile,
    education: updatedEducation
  });
};

 const handleEducationChange = (
  index,
  field,
  value
) => {
  const updatedEducation = [...profile.education];

  updatedEducation[index][field] = value;

  setProfile({
    ...profile,
    education: updatedEducation
  });
};


const addProject = () => {
  setProfile({
    ...profile,
    projects: [
      ...profile.projects,
      {
        title: "",
        description: "",
        technologies: [],
        liveUrl: "",
        startDate: "",
        endDate: ""
      }
    ]
  });
};

const removeProject = (index) => {
  setProfile({
    ...profile,
    projects: profile.projects.filter(
      (_, i) => i !== index
    )
  });
};

const handleProjectChange = (
  index,
  field,
  value
) => {
  const updatedProjects = [...profile.projects];

  updatedProjects[index][field] = value;

  setProfile({
    ...profile,
    projects: updatedProjects
  });
};


  const fetchProfile = async () => {
    try {

      const res = await API.get("/profile");

      setProfile({
        name: res.data.profile.name || "",
        email: res.data.profile.email || "",
        skills: res.data.profile.skills?.join(", ") || "",
        // experience: res.data.profile.experience?.map(exp => `${exp.role} at ${exp.company}`).join("\n") || "",
        experience: res.data.profile.experience || "",
        education: res.data.profile.education || "",
        projects: res.data.profile.projects|| "",
      });

    } catch (error) {
      console.error(error);
    }
  };

  // handle input
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // update profile
  const handleSave = async () => {
    try {

      setLoading(true);

      const updatedData = {
        ...profile,
        skills: profile.skills.split(",").map(skill => skill.trim())
      };

      
      const res = await API.put(
        "/profile/update",
        updatedData
      );

      setLoading(false);

      alert("Profile updated successfully");
      navigate("/profile");
    } catch (error) {

      setLoading(false);

      console.error(error);

      alert("Failed to update profile");
    }
  };
  console.log("experience data ---------------> ", JSON.stringify(profile));
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          My Profile 👤
        </h2>

        <div className="space-y-5">

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block mb-1 font-medium">
              Skills
            </label>

            <textarea
              rows="3"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

   <h2 className="text-xl font-bold mb-4">
           Experience
        </h2>

{profile.experience.map((exp, index) => (
  <div
    key={index}
    className="border rounded-lg p-4 mb-4"
  >
    <input
      value={exp.role}
      onChange={(e) =>
        handleExperienceChange(
          index,
          "role",
          e.target.value
        )
      }
      className="border p-2 w-full mb-2"
      placeholder="Role"
    />

    <input
      value={exp.company}
      onChange={(e) =>
        handleExperienceChange(
          index,
          "company",
          e.target.value
        )
      }
      className="border p-2 w-full mb-2"
      placeholder="Company"
    />

   

    <textarea
      value={exp.description}
      onChange={(e) =>
        handleExperienceChange(
          index,
          "description",
          e.target.value
        )
      }
      className="border p-2 w-full"
      placeholder="Description"
    />

       <div className="grid grid-cols-2 gap-2">
      <input
    type="date"
    value={exp.startDate?.split("T")[0] || ""}
    onChange={(e) =>
      handleExperienceChange(
      index,
      "startDate",
      e.target.value
    )
  }
  className="border p-2 rounded w-full"
/>

    <input
   type="date"
    value={exp.endDate?.split("T")[0] || ""}
    onChange={(e) =>
      handleExperienceChange(
        index,
        "endDate",
        e.target.value
      )
    }
    className="border p-2 rounded w-full"
  />
    </div>

    <button
      onClick={() => removeExperience(index)}
      className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
    >
      Remove
    </button>
  </div>
))}

<button
  onClick={addExperience}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  + Add Experience
</button>

<h2 className="text-xl font-bold mb-4">
           Education
</h2>

{profile.education.map((edu, index) => (
  <div
    key={index}
    className="border rounded-lg p-4 mb-4"
  >
    <input
      value={edu.degree}
      onChange={(e) =>
        handleEducationChange(
          index,
          "degree",
          e.target.value
        )
      }
      className="border p-2 w-full mb-2"
      placeholder="Degree"
    />

    <input
      value={edu.institution}
      onChange={(e) =>
        handleEducationChange(
          index,
          "institution",
          e.target.value
        )
      }
      className="border p-2 w-full mb-2"
      placeholder="Institution"
    />

    
     <div className="grid grid-cols-2 gap-2">
            <input
    type="date"
    value={edu.startDate?.split("T")[0] || ""}
    onChange={(e) =>
      handleEducationChange(
      index,
      "startDate",
      e.target.value
    )
  }
  className="border p-2 rounded w-full"
/>

    <input
   type="date"
    value={edu.endDate?.split("T")[0] || ""}
    onChange={(e) =>
      handleEducationChange(
        index,
        "endDate",
        e.target.value
      )
    }
    className="border p-2 rounded w-full"
  />
    </div>

  
    <button
      onClick={() => removeEducation(index)}
      className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
    >
      Remove
    </button>
  </div>
))}

<button
  onClick={addEducation}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  + Add Education
</button>

<h2 className="text-xl font-bold mb-4">
  Projects
</h2>

{profile.projects.map((project, index) => (
  <div
    key={index}
    className="border rounded-lg p-4 mb-4 bg-white"
  >
    <input
      type="text"
      placeholder="Project Title"
      value={project.title}
      onChange={(e) =>
        handleProjectChange(
          index,
          "title",
          e.target.value
        )
      }
      className="w-full border p-2 rounded mb-2"
    />

    <textarea
      placeholder="Project Description"
      value={project.description}
      onChange={(e) =>
        handleProjectChange(
          index,
          "description",
          e.target.value
        )
      }
      className="w-full border p-2 rounded mb-2"
    />

    <input
      type="text"
      placeholder="Technologies (comma separated)"
      value={project.technologies?.join(", ") || ""}
      onChange={(e) =>
        handleProjectChange(
          index,
          "technologies",
          e.target.value
            .split(",")
            .map((tech) => tech.trim())
        )
      }
      className="w-full border p-2 rounded mb-2"
    />


    <input
      type="text"
      placeholder="Live URL"
      value={project.liveUrl}
      onChange={(e) =>
        handleProjectChange(
          index,
          "liveUrl",
          e.target.value
        )
      }
      className="w-full border p-2 rounded mb-2"
    />

    <div className="grid grid-cols-2 gap-2">
     
           <input
    type="date"
    value={project.startDate?.split("T")[0] || ""}
    onChange={(e) =>
      handleProjectChange(
      index,
      "startDate",
      e.target.value
    )
  }
  className="border p-2 rounded w-full"
/>

    <input
   type="date"
    value={project.endDate?.split("T")[0] || ""}
    onChange={(e) =>
      handleProjectChange(
        index,
        "endDate",
        e.target.value
      )
    }
    className="border p-2 rounded w-full"
  />

    </div>

    <button
      onClick={() => removeProject(index)}
      className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
    >
      Remove Project
    </button>
  </div>
))}

<button
  onClick={addProject}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  + Add Project
</button>



          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;