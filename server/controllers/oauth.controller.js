import passport from "../utils/passport.js"; 
import { generateTokenAndSetCookie } from "../utils/Token/token.js";

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    generateTokenAndSetCookie(user._id, res);

    // return res.status(200).json({
    //   message: "Signed in with Google successfully",
    //   user: {
    //     _id: user._id,
    //     fullName: user.fullName,
    //     username: user.username,
    //     email: user.email,
    //     isVerified: user.isVerified,
    //   },
    // });

    res.redirect(`${process.env.CLIENT_URL}`);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};