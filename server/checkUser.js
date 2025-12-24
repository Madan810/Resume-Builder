import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/User.js";

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = "madankumarcm82@gmail.com";
        const user = await User.findOne({ email });
        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`Reset Token: ${user.resetPasswordToken}`);
        } else {
            console.log(`User NOT found: ${email}`);
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

checkUser();
