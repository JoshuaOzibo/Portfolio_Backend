import { Router } from "express";
import { createExperience, getAllExperiences, updateExperience, deleteExperience } from "../controllers/experience_controller.js";

const router = Router();

router.post("/", createExperience);

router.get("/", getAllExperiences);

router.put("/:id", updateExperience);

router.delete("/:id", deleteExperience);

export default router;  

