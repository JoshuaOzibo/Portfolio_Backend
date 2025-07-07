import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    skills: {
        type: [String],
        required: true,
        trim: true,
        index: true
    },
    liveLink: {
        type: String,
        required: true,
        trim: true,
    },
    githubLink: {   
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    imageSize: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        trim: true,
        enum: ["Live", "In Progress", "Draft"],
        index: true
    },
    featured: {
        type: Boolean,
        trim: true,
        default: false,
        index: true
    }
    
}, {
    timestamps: true,
    indexes: [
        { createdAt: -1 },
        { status: 1, featured: 1 }
    ]
});

const Project = mongoose.model('Project', projectSchema);

export default Project;


