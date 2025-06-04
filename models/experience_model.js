import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    companyName: {
        
    }
}, {timestamp: true});

const experience = mongoose.model("experience", experienceSchema);

export default experience;
