import { Router } from "express";
import { createSocial, getAllSocials, updateSocial, deleteSocial } from "../controllers/social_controller.js";

const router = Router();

router.post("/create", createSocial);
router.get("/", getAllSocials);
router.put("/:id", updateSocial);
router.delete("/:id", deleteSocial);

export default router;