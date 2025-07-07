import express from "express";
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject, getAllProjectsSimple } from "../controllers/project_controller.js";

const router = express.Router();

// create project
router.post('/create', createProject);

// get all projects
router.get('/', getAllProjects);

// get all projects without pagination (for frontend)
router.get('/all', getAllProjectsSimple);

// get project by id
router.get('/:id', getProjectById);

// update project
router.put('/:id', updateProject);

// delete project
router.delete('/:id', deleteProject);

export default router;

