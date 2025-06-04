import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    link: {
        type: String,
        required: true,
        trim: true,
    }
}, {timestamps: true});

const social = mongoose.model("social", socialSchema);
