import express from "express";
import { checkauth, signinController, signoutController, signupController } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import passport from "../utils/passport.js";
import { googleAuth, googleAuthCallback } from "../controllers/oauth.controller.js";
import { authLimiter } from "../utils/rateLimiter.js";

const authRouter = express.Router();

authRouter.post("/signup",authLimiter,signupController);
authRouter.post("/signin",authLimiter,signinController);
authRouter.post("/signout",protectRoute,signoutController);
authRouter.get("/protected",protectRoute,checkauth);

authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", 
    passport.authenticate("google", { 
      failureRedirect: `${process.env.CLIENT_URL}/sign-in?error=google_auth_failed`,
      session: false 
    }),googleAuthCallback
  );

export default authRouter;

//Google OAuth → Get user → Issue JWT → Store in HTTP-only cookie

