import skill from "../models/skill_model.js";


// create skill
const createSkill = async (req, res) => {
  try {
    const { skillName, image } = req.body;

    if (!skillName || !image) {
      return res
        .status(400)
        .json({ message: "Skill name and image are required" });
    }

    const newSkill = new skill({ skillName, image });
    await newSkill.save();

    res
      .status(201)
      .json({ message: "Skill created successfully", skill: newSkill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating skill", error: error.message });
  }
};

// get all skills
const getAllSkills = async (req, res) => {
  if (!req.body.skillName || !req.body.image) {
    throw new ApiError(400, "Skill name and image are not found");
  }

  try {
    const skills = await skill.find();
    res.status(200).json({ skills });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching skills", error: error.message });
  }
};

// get skill by id
const getSkillById = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, "Skill id is not found");
    }

    const { id } = req.params;
    const skill = await skill.findById(id);
    res.status(200).json({ skill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching skill", error: error.message });
  }
};

// update skill
const updateSkill = async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Error updating skill", error: error.message });
  }
};

// delete skill
const deleteSkill = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, "Skill id is not found");
    }

    const { id } = req.params;
    await skill.findByIdAndDelete(id);
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting skill", error: error.message });
  }
};


export { createSkill, getAllSkills, getSkillById, updateSkill, deleteSkill };
