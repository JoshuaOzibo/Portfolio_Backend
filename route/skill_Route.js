import express from "express";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../controllers/skill_controller.js";

const router = express.Router();

// create skill
router.post("/create", createSkill);

// get all skills
router.get("/", getAllSkills);

// get skill by id
router.get("/:id", getSkillById);

// update skill
router.put("/:id", updateSkill);

// delete skill
router.delete("/:id", deleteSkill);

export default router;
