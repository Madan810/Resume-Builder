import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/User.js";

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, "email name");
        console.log("Registered Users:");
        users.forEach(u => console.log(`- ${u.email} (${u.name})`));
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

listUsers();
