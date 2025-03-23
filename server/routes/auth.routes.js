import express from "express";
import { checkauth, signinController, signoutController, signupController } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import passport from "../utils/passport.js";
import { googleAuth, googleAuthCallback } from "../controllers/oauth.controller.js";
import { authLimiter } from "../utils/rateLimiter.js";

const authRouter = express.Router();

authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.post("/signup",authLimiter,signupController);
authRouter.post("/signin",authLimiter,signinController);
authRouter.post("/signout",protectRoute,signoutController);
authRouter.get("/protected",protectRoute,checkauth);

authRouter.get("/google", googleAuth);
authRouter.get( "/google/callback",  passport.authenticate("google", { failureRedirect: "/signin" }), googleAuthCallback);

export default authRouter;