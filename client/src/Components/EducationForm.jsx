import { GraduationCap, Plus, Trash2 } from "lucide-react";
import React from "react";

const EducationForm = ({ data = [], onChange }) => {
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      description: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updatedEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <p className="text-sm text-gray-500">Add your education details</p>
        </div>

        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 
          text-green-700 rounded-lg hover:bg-green-200 transition"
        >
          <Plus className="size-4" /> Add Education
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
          <p className="text-sm">Click “Add Education” to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={index}
              className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white space-y-4"
            >
              {/* Title + Delete */}
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-700">
                  Education #{index + 1}
                </h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Input Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Institution */}
                <input
                  value={education.institution || ""}
                  onChange={(e) =>
                    updatedEducation(index, "institution", e.target.value)
                  }
                  type="text"
                  placeholder="Institution Name"
                  className="px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                  focus:ring-2 focus:ring-purple-300 outline-none text-sm w-full"
                />

                {/* Degree */}
                <input
                  value={education.degree || ""}
                  onChange={(e) =>
                    updatedEducation(index, "degree", e.target.value)
                  }
                  type="text"
                  placeholder="Degree (e.g., Bachelor's, Master's)"
                  className="px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                  focus:ring-2 focus:ring-purple-300 outline-none text-sm w-full"
                />

                {/* Field of Study */}
                <input
                  value={education.field || ""}
                  onChange={(e) =>
                    updatedEducation(index, "field", e.target.value)
                  }
                  type="text"
                  placeholder="Field of Study"
                  className="px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                  focus:ring-2 focus:ring-purple-300 outline-none text-sm w-full"
                />

                {/* Graduation Date */}
                <input
                  value={education.graduation_date || ""}
                  onChange={(e) =>
                    updatedEducation(index, "graduation_date", e.target.value)
                  }
                  type="month"
                  className="px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                  focus:ring-2 focus:ring-purple-300 outline-none text-sm w-full"
                />
              </div>

              {/* GPA */}
              <input
                value={education.gpa || ""}
                onChange={(e) =>
                  updatedEducation(index, "gpa", e.target.value)
                }
                type="text"
                placeholder="GPA (optional)"
                className="w-full px-3 py-2 shadow-sm rounded-lg border border-gray-200 
                focus:ring-2 focus:ring-purple-300 outline-none text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
