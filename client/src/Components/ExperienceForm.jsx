import { Briefcase, Plus, Sparkles, Trash2, Loader2 } from "lucide-react";
import React, { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";

const ExperienceForm = ({ data = [], onChange }) => {
  const [loading, setLoading] = useState(false);

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updatedExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleEnhance = async (index) => {
    const experience = data[index];
    if (!experience.description) {
      toast.error("Please add a description to enhance");
      return;
    }

    setLoading(true);
    try {
      const { data: resData } = await api.post("/api/ai/enhance-job-desc", {
        userContent: experience.description,
      });
      updatedExperience(index, "description", resData.enhancedContent);
      toast.success("Description enhanced successfully");
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
          <h3 className="text-lg font-semibold text-gray-900">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">Add your job experience</p>
        </div>

        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 
          text-green-700 rounded-lg hover:bg-green-200 transition"
        >
          <Plus className="size-4" /> Add Experience
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click “Add Experience” to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-5 border border-gray-200 rounded-xl shadow-sm 
              bg-white space-y-4"
              style={{ borderRadius: "14px" }}
            >
              {/* Title + Delete */}
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-700">
                  Experience #{index + 1}
                </h4>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Input Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Company */}
                <input
                  value={experience.company || ""}
                  onChange={(e) =>
                    updatedExperience(index, "company", e.target.value)
                  }
                  type="text"
                  placeholder="Company Name"
                  className="px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                  focus:ring-2 focus:ring-purple-300 outline-none text-sm"
                />

                {/* Position */}
                <input
                  value={experience.position || ""}
                  onChange={(e) =>
                    updatedExperience(index, "position", e.target.value)
                  }
                  type="text"
                  placeholder="Job Title"
                  className="px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                  focus:ring-2 focus:ring-purple-300 outline-none text-sm"
                />

                {/* Start Date */}
                <input
                  value={experience.start_date || ""}
                  onChange={(e) =>
                    updatedExperience(index, "start_date", e.target.value)
                  }
                  type="month"
                  className="px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                  focus:ring-2 focus:ring-purple-300 outline-none text-sm"
                />

                {/* End Date */}
                <input
                  value={experience.end_date || ""}
                  onChange={(e) =>
                    updatedExperience(index, "end_date", e.target.value)
                  }
                  type="month"
                  disabled={experience.is_current}
                  className="px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                  disabled:bg-gray-100 focus:ring-2 focus:ring-purple-300 outline-none text-sm"
                />
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e) =>
                    updatedExperience(index, "is_current", e.target.checked)
                  }
                  className="rounded border-gray-300 text-purple-600 
                  focus:ring-purple-500"
                />
                Currently working here
              </label>

              {/* Job Description */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">
                    Job Description
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
                  value={experience.description || ""}
                  onChange={(e) =>
                    updatedExperience(index, "description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                  focus:ring-2 focus:ring-purple-300 outline-none text-sm resize-none"
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
