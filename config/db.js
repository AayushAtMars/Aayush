import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
const url = process.env.MONGO_URI

export const dbConnect = async () => {
    if (!url) {
        console.error("MONGO_URI is not defined in environment variables.");
        process.exit(1);
    }
    try {
        await mongoose.connect(url)
        console.log("DB Ka Connection Succesful");
    }
    catch (err) {
        console.log("Error conntecting DB")
        console.error("MongoDB connection error:", err);
        process.exit(1);

    }

}