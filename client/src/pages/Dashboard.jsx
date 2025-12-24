import React, { useEffect, useState } from 'react'
import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, UploadCloud, XIcon } from 'lucide-react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from "../configs/api"   // ✅ FIXED: API IMPORT
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth)

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]

  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')

  const navigate = useNavigate()

  const loadAllResumes = async () => {
    setAllResumes(dummyResumeData)
  }

  // ✅ Create Resume API
  const createResume = async (event) => {
    try {
      event.preventDefault()

      const { data } = await api.post(
        '/api/resumes/create',
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)

      // Navigate to builder
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    try {
      event.preventDefault()

      if (!resume) {
        toast.error("Please select a resume file")
        return
      }

      toast.loading("Extracting resume data...")

      // Extract text from PDF using react-pdftotext
      const resumeText = await pdfToText(resume)

      const { data } = await api.post(
        '/api/ai/upload-resume',
        { resumeText, title: resume.name.replace('.pdf', '') },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.dismiss()
      toast.success("Resume uploaded successfully!")
      setShowUploadResume(false)
      setResume(null)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.dismiss()
      toast.error(error?.response?.data?.message || error.message || "Failed to upload resume")
    }
  }

  const editTitle = async (event) => {
    event.preventDefault()
    toast.success("Resume title updated (Demo Mode)")
    setEditResumeId('')
  }

  const deleteResume = async (resumeId) => {
    const confirmDelete = window.confirm("Are you sure?")
    if (confirmDelete) {
      setAllResumes((prev) => prev.filter((res) => res._id !== resumeId))
      toast.success("Deleted")
    }
  }

  useEffect(() => {
    loadAllResumes()
  }, [])

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">

        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer"
          >
            <PlusIcon className="size-11 p-2.5 bg-indigo-500 text-white rounded-full" />
            <p className="text-sm">Create Resume</p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer"
          >
            <UploadCloudIcon className="size-11 p-2.5 bg-purple-500 text-white rounded-full" />
            <p className="text-sm">Upload Existing</p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[350px]" />

        {/* RESUME CARDS */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length]

            return (
              <button
                key={index}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border hover:shadow-lg transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon className="size-7" style={{ color: baseColor }} />

                <p className="text-sm px-2 text-center" style={{ color: baseColor }}>
                  {resume.title}
                </p>

                <p className="absolute bottom-1 text-[11px] text-slate-500">
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                {/* ICONS */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 hidden group-hover:flex gap-1"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id)
                      setTitle(resume.title)
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700"
                  />
                </div>
              </button>
            )
          })}
        </div>

        {/* CREATE RESUME MODAL */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>

              <input
                type="text"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => {
                  setShowCreateResume(false)
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}

        {/* UPLOAD RESUME MODAL */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

              <label htmlFor="resume-input" className="block text-sm text-slate-700">
                Select resume file
                <div className="flex flex-col items-center justify-center gap-2 border border-dashed rounded-md p-4 py-10 my-4 text-slate-400 hover:border-green-500 hover:text-green-700 cursor-pointer transition">
                  {resume ? (
                    <p className="text-green-700">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloud className="size-14 stroke-1" />
                      <p>Upload resume</p>
                    </>
                  )}
                </div>
              </label>

              <input type="file" id="resume-input" hidden accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Upload Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => {
                  setShowUploadResume(false)
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}

        {/* EDIT RESUME MODAL */}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId('')}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>

              <input
                type="text"
                placeholder="Enter resume title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded focus:border-green-600"
                required
              />

              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Update
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => {
                  setEditResumeId('')
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Dashboard
