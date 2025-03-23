import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/auth.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
      callbackURL: "/api/auth/google/callback", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          username: profile.emails[0].value.split("@")[0], 
          isVerified: true, 
        });
        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

//Determines what data to store in the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Retrieves the complete user object when needed
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;