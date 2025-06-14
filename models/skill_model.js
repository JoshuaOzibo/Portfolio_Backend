import mongoose from "mongoose";


const skillSchema = new mongoose.Schema({
    skillName: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },

}, {timestamps: true});

const skill = mongoose.model("skill", skillSchema);

export default skill;
