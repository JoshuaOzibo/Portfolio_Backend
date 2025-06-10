import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        
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

    status: {
        type: String,
       
        trim: true,
        enum: ["Live", "In Progress", "Draft"]
    },

   featured: {
        type: Boolean,
    
        trim: true
    }
    
}, {timestamps: true})


const Project = mongoose.model('Project', projectSchema);

export default Project;


