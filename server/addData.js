import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/User.js";
import Resume from "./models/Resume.js";

const addData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI + "/resume-builder");
        const email = "madankumarcm82@gmail.com";
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found. Please register first.");
            await mongoose.disconnect();
            return;
        }

        const sampleResume = new Resume({
            userId: user._id,
            title: "Software Engineer Resume",
            professional_summary: "Passionate developer with experience in React and Node.js.",
            personal_info: {
                full_name: "Madan Kumar",
                profession: "Full Stack Developer",
                email: email,
                phone: "+91 9876543210",
                location: "India"
            },
            skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
            experience: [
                {
                    company: "Antigravity AI",
                    position: "Senior Developer",
                    start_date: "2023-01",
                    end_date: "Present",
                    description: "Scaling agentic AI systems.",
                    is_current: true
                }
            ],
            education: [
                {
                    institution: "Tech University",
                    degree: "Bachelor of Technology",
                    field: "Computer Science",
                    graduation_date: "2022",
                    gpa: "4.0"
                }
            ]
        });

        await sampleResume.save();
        console.log("Sample resume added successfully!");
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

addData();
