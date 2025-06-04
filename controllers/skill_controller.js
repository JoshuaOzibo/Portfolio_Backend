import Skill from "../models/skill_model.js";
import { catchAsync, ApiError } from "../middleware/errorHandler.js";

// create skill
const createSkill = catchAsync(async (req, res) => {
    const { skillName, image } = req.body;

    if (!skillName || !image) {
        throw new ApiError(400, "Skill name and image are required");
    }

    const existingSkill = await Skill.findOne({ skillName });
    if (existingSkill) {
        throw new ApiError(409, "Skill already exists");
    }

    const newSkill = await Skill.create({ skillName, image });

    res.status(201).json({
        message: "Skill created successfully",
        status: 'success',
        data: {
            newSkill
        }
    });
});

// get all skills
const getAllSkills = catchAsync(async (req, res) => {
    const skills = await Skill.find().sort({ createdAt: -1 });
    
    res.status(200).json({
        status: 'success',
        results: skills.length,
        data: {
            skills
        }
    });
});

// get skill by id
const getSkillById = catchAsync(async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }

    res.status(200).json({
        status: 'success',
        data: {
            skill
        }
    });
});

// update skill
const updateSkill = catchAsync(async (req, res) => {
    const { skillName, image } = req.body;
    
    const skill = await Skill.findByIdAndUpdate(
        req.params.id,
        { skillName, image },
        {
            new: true,
            runValidators: true
        }
    );
    
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }

    res.status(200).json({
        status: 'success',
        data: {
            skill
        }
    });
});

// delete skill
const deleteSkill = catchAsync(async (req, res) => {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

export { createSkill, getAllSkills, getSkillById, updateSkill, deleteSkill };
