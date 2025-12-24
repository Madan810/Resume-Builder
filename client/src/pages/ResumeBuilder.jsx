import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowBigLeftIcon,
  Briefcase,
  FileText,
  FolderIcon,
  GraduationCap,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon,
} from "lucide-react";
import api from "../configs/api";
import toast from "react-hot-toast";

import PersonalInfoForm from "../Components/PersonalInfoForm";
import ResumePreview from "../Components/ResumePreview";
import TemplateSelector from "../Components/TemplateSelector";
import ColorPicker from "../Components/ColorPicker";
import ProfessionalSummaryForm from "../Components/ProfessionalSummaryForm";
import ExperienceForm from "../Components/ExperienceForm";
import EducationForm from "../Components/EducationForm";
import ProjectForm from "../Components/ProjectForm";
import SkillForm from "../Components/SkillForm";

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`);
      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      console.error("Error loading resume:", error.message);
      // Fallback to dummy data for development if API fails
      const resume = dummyResumeData.find((r) => r._id === resumeId);
      if (resume) {
        setResumeData(resume);
        document.title = resume.title;
      }
    }
  };

  const saveResume = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("removeBackground", removeBackground);

      // If image is a File object, it's a new upload
      if (resumeData.personal_info.image instanceof File) {
        formData.append("image", resumeData.personal_info.image);
      }

      // Clone data and remove image if it's a File (backend handles it via req.file)
      const dataToSave = { ...resumeData };
      if (dataToSave.personal_info.image instanceof File) {
        dataToSave.personal_info.image = "";
      }

      formData.append("resumeData", JSON.stringify(dataToSave));

      const { data } = await api.put("/api/resumes/update", formData);

      if (data.resume) {
        setResumeData(data.resume);
        toast.success("Resume saved successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save resume");
    }
  };

  useEffect(() => {
    loadExistingResume();
  }, [resumeId]);

  const changeResumeVisibility = async () => {
    setResumeData({ ...resumeData, public: !resumeData.public })
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume", })
    } else {
      alert('Share not supported on this browser.')
    }
  }

  const downloadResume = () => {
    window.print();
  }

  return (
    <div>
      {/* Top Nav */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowBigLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left Panel */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">

              {/* Progress Bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">

                {/* Template + Color */}
                <div className="flex items-center gap-3">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({ ...prev, template }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({ ...prev, accent_color: color }))
                    }
                  />
                </div>

                {/* Nav Buttons */}
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.min(prev + 1, sections.length - 1)
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium 
                      text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1
                        ? "opacity-50"
                        : ""
                      }`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Form Section */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                    setResumeData={setResumeData}
                  />
                )}

                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />


                )}

                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />


                )}

                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        project: data,
                      }))
                    }
                  />




                )}

                {activeSection.id === "skills" && (
                  <SkillForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />




                )}

              </div>
              <button
                onClick={saveResume}
                className='bg-gradient-to-br from-green-100 to-green-200
              ring-green-300 text-green-600 ring hover:ring-green-400
              transition-all rounded-md px-6 py-2 mt-6 text-sm font-medium'
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel (Preview) */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">

              {/* Button Group Positioned Bottom-Right */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">

                {/* Share Button (only when public) */}
                {resumeData.public && (
                  <button onClick={handleShare}
                    className="flex items-center p-2 px-4 gap-2 text-xs
          bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600
          rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4" /> Share
                  </button>
                )}

                {/* Public / Private Toggle Button */}
                <button onClick={changeResumeVisibility}
                  className="flex items-center p-2 px-4 gap-2 text-xs
        bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600
        rounded-lg ring-purple-300 hover:ring transition-colors"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>

                {/* Download Button */}
                <button onClick={downloadResume}
                  className="flex items-center p-2 px-4 gap-2 text-xs
        bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600
        rounded-lg ring-blue-300 hover:ring transition-colors"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>

              </div>
              {/* --- buttons ---- */}
            </div>
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
