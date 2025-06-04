import { Router } from "express";
import { createSocial } from "../controllers/social_controller.js";

const router = Router();

router.post("/create", createSocial);

export default router;