import e from "express";
import mongoose from "mongoose";

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected✅");
    }
    catch (err) {
        console.log("MongoDB connection error", err);
        process.exit(1);
    }
}

export default connectdb;