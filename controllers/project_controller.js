import Project from "../models/project_model.js";
import { catchAsync, ApiError } from "../middleware/errorHandler.js";

// Create a new project
const createProject = catchAsync(async (req, res) => {
    const { title, description, skills, liveLink, githubLink, image, status } = req.body;
    

    // Validate required fields
    if (!title || !description || !skills || !liveLink || !githubLink || !image || !status) {
        throw new ApiError(400, "All fields are required");
    }

    // Calculate image size if it's base64
    let imageSize = 0;
    if (image && image.startsWith('data:image')) {
        // Remove data URL prefix to get base64 string
        const base64String = image.split(',')[1];
        imageSize = Buffer.byteLength(base64String, 'base64');
    }

    // Create new project
    const project = await Project.create({
        title,
        description,
        skills: Array.isArray(skills) ? skills : [skills],
        liveLink,
        githubLink,
        image,
        imageSize,
        status,
    });

    res.status(201).json({
        status: 'success',
        data: {
            project
        }
    });
});

// Get all projects with pagination and filtering
const getAllProjects = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.featured !== undefined) filter.featured = req.query.featured === 'true';
    if (req.query.skills) {
        filter.skills = { $in: req.query.skills.split(',') };
    }

    // Include images by default for frontend compatibility
    const projection = req.query.excludeImage === 'true' 
        ? { image: 0 } 
        : {};

    // Get total count for pagination
    const total = await Project.countDocuments(filter);
    
    // Get projects with pagination
    const projects = await Project.find(filter, projection)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean() for better performance when you don't need Mongoose documents
    
    res.status(200).json({
        status: 'success',
        results: projects.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
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
    const { title, description, skills, liveLink, githubLink, image, status} = req.body;
    
    // Calculate image size if image is being updated
    let imageSize = undefined;
    if (image && image.startsWith('data:image')) {
        const base64String = image.split(',')[1];
        imageSize = Buffer.byteLength(base64String, 'base64');
    }

    const updateData = {
        title,
        description,
        skills: Array.isArray(skills) ? skills : [skills],
        liveLink,
        githubLink,
        image,
        status
    };

    if (imageSize !== undefined) {
        updateData.imageSize = imageSize;
    }
    
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        updateData,
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

// Get all projects without pagination (for frontend)
const getAllProjectsSimple = catchAsync(async (req, res) => {
    const projects = await Project.find({}, { image: 1, title: 1, description: 1, skills: 1, liveLink: 1, githubLink: 1, status: 1, featured: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .lean();
    
    res.status(200).json({
        status: 'success',
        results: projects.length,
        data: {
            projects
        }
    });
});

export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getAllProjectsSimple
};
