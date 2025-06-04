import skill from "../models/skill_model.js";
import { catchAsync } from "../middleware/errorHandler.js";

// create skill
const createSkill = catchAsync(async (req, res) => {
  try {
    const { skillName, image } = req.body;

    if (!skillName || !image) {
      throw new ApiError(400, "Skill name and image are required");
    }

    const newSkill = new skill({ skillName, image });
    await newSkill.save();

    res
      .status(201)
      .json({ message: "Skill created successfully", skill: newSkill });
  } catch (error) {
    throw new ApiError(500, "Error creating skill", error.message);
  }
});

// get all skills
const getAllSkills = catchAsync(async (req, res) => {
  if (!req.body.skillName || !req.body.image) {
    throw new ApiError(400, "Skill name and image are not found");
  }

  try {
    const skills = await skill.find();
    res.status(200).json({ skills });
  } catch (error) {
    throw new ApiError(500, "Error fetching skills", error.message);
  }
});

// get skill by id
const getSkillById = catchAsync(async (req, res) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, "Skill id is not found");
    }

    const { id } = req.params;
    const skill = await skill.findById(id);
    res.status(200).json({ skill });
  } catch (error) {
    throw new ApiError(500, "Error fetching skill", error.message);
  }
});

// update skill
const updateSkill = catchAsync(async (req, res) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, "Skill id is not found");
    }

    const { id } = req.params;
    const { skillName, image } = req.body;
    const updatedSkill = await skill.findByIdAndUpdate(
      id,
      { skillName, image },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Skill updated successfully", skill: updatedSkill });
  } catch (error) {
    throw new ApiError(500, "Error updating skill", error.message);
  }
});

// delete skill
const deleteSkill = catchAsync(async (req, res) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, "Skill id is not found");
    }

    const { id } = req.params;
    await skill.findByIdAndDelete(id);
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    throw new ApiError(500, "Error deleting skill", error.message);
  }
});

export { createSkill, getAllSkills, getSkillById, updateSkill, deleteSkill };
