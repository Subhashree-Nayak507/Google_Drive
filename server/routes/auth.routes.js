import express from "express";
import { signinController, signoutController, signupController } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup",signupController);
authRouter.post("/signin",signinController);
authRouter.post("/signout",signoutController);


export default authRouter;