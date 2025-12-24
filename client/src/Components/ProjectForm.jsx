import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import React, { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";

const ProjectForm = ({ data = [], onChange }) => {
  const [loading, setLoading] = useState(false);

  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
      is_active: false, // Default to inactive? Or maybe just keep consistent structure
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updatedProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleEnhance = async (index) => {
    const project = data[index];
    if (!project.description) {
      toast.error("Please add a description to enhance");
      return;
    }

    setLoading(true);
    try {
      const { data: resData } = await api.post("/api/ai/enhance-job-desc", {
        userContent: project.description,
      });
      // Assuming we can use the job-desc endpoint for projects too, as it's just text enhancement
      updatedProject(index, "description", resData.enhancedContent);
      toast.success("Project description enhanced successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <p className="text-sm text-gray-500">Add your projects</p>
        </div>

        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 
          text-green-700 rounded-lg hover:bg-green-200 transition"
        >
          <Plus className="size-4" /> Add Project
        </button>
      </div>

      {/* Projects */}
      <div className="space-y-4 mt-6">
        {data.map((project, index) => (
          <div
            key={index}
            className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white space-y-4"
          >
            {/* Title + Delete */}
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-700">
                Project #{index + 1}
              </h4>
              <button
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            {/* Inputs */}
            <div className="grid gap-3">

              {/* Project Name */}
              <input
                value={project.name || ""}
                onChange={(e) =>
                  updatedProject(index, "name", e.target.value)
                }
                type="text"
                placeholder="Project Name"
                className="w-full px-3 py-2 text-sm shadow-sm rounded-lg border border-gray-200"
              />

              {/* Project Type */}
              <input
                value={project.type || ""}
                onChange={(e) =>
                  updatedProject(index, "type", e.target.value)
                }
                type="text"
                placeholder="Project Type"
                className="w-full px-3 py-2 text-sm shadow-sm rounded-lg border border-gray-200"
              />

              {/* Description */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">
                    Description
                  </label>

                  <button
                    onClick={() => handleEnhance(index)}
                    disabled={loading}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 
                  text-purple-700 rounded-md hover:bg-purple-200 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Sparkles className="size-3" />
                    )}
                    Enhance with AI
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={project.description || ""}
                  onChange={(e) =>
                    updatedProject(index, "description", e.target.value)
                  }
                  placeholder="Describe your project..."
                  className="w-full px-3 py-2 text-sm shadow-sm rounded-lg border border-gray-200 resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;
