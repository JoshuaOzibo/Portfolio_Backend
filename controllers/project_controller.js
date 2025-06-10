import Project from "../models/project_model.js";
import { catchAsync, ApiError } from "../middleware/errorHandler.js";

// Create a new project
const createProject = catchAsync(async (req, res) => {
    const { title, description, skills, liveLink, githubLink, image } = req.body;
    

    // Validate required fields
    if (!title || !description || !skills || !liveLink || !githubLink || !image) {
        throw new ApiError(400, "All fields are required");
    }

    // Create new project
    const project = await Project.create({
        title,
        description,
        skills: Array.isArray(skills) ? skills : [skills],
        liveLink,
        githubLink,
        image
    });

    res.status(201).json({
        status: 'success',
        data: {
            project
        }
    });
});

// Get all projects
const getAllProjects = catchAsync(async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.status(200).json({
        status: 'success',
        results: projects.length,
        data: {
            projects
        }
    });
});

// Get single project by ID
const getProjectById = catchAsync(async (req, res) => {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    res.status(200).json({
        status: 'success',
        data: {
            project
        }
    });
});

// Update project
const updateProject = catchAsync(async (req, res) => {
    const { title, description, skills, liveLink, githubLink, image } = req.body;
    
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        {
            title,
            description,
            skills: Array.isArray(skills) ? skills : [skills],
            liveLink,
            githubLink,
            image
        },
        {
            new: true,
            runValidators: true
        }
    );
    
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    res.status(200).json({
        status: 'success',
        data: {
            project
        }
    });
});

// Delete project
const deleteProject = catchAsync(async (req, res) => {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};
