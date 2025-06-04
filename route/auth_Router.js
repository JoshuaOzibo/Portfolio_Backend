import { Router } from "express";
import { signUpController, signInController } from "../controllers/auth_controller.js";

const authRouter = Router();

// signin
authRouter.post("/sign-up", signUpController);

// sign-in
authRouter.post("/sign-in", signInController);

//sign-out
authRouter.post("/sign-out", async (req, res, next) => {
  res.send("signOut route");
});

export default authRouter;
