import User from "../models/auth.model.js";
import { generateOTP, sendOTPEmail } from "../utils/otp/otp.js";

export const signupController = async (req, res) => {
    try {
      // First request - create user and send OTP
      if (!req.body.otp) {
        const { username, fullName, email, password } = req.body;
        
        if (!username || !fullName || !email || !password) {
          return res.status(400).json({
            message: "Fill up all fields"
          });
        }
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ error: "Username is already taken" });
        }
        
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ error: "Email is already taken" });
        }
        
        if (password.length < 6) {
          return res.status(400).json({ error: "Password must be at least 6 characters" });
        }
        
        const newUser = new User({
          fullName,
          username,
          email,
          password,
          isVerified: false
        });
        
        if (newUser) {
          const otp = generateOTP();
          const otpExpiry = new Date();
          otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        
          newUser.otp = otp;
          newUser.otpExpiry = otpExpiry;
          
         
          await sendOTPEmail(email, otp);
          await newUser.save();
          
          return res.status(201).json({
            message: "Account created successfully. Please verify OTP sent to your email",
            user: {
              _id: newUser._id,
              fullName: newUser.fullName,
              username: newUser.username,
              email: newUser.email
            }
          });
        } else {
          return res.status(400).json({ message: "Invalid user data" });
        }
      } 
      else {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
          return res.status(400).json({ message: "Email and OTP are required" });
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        // Check if OTP is correct and not expired
        if (user.otp !== otp) {
          return res.status(400).json({ message: "Invalid OTP" });
        }
        
        if (new Date() > user.otpExpiry) {
          return res.status(400).json({ message: "OTP has expired" });
        }
        
        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined; // Clear OTP after successful verification
        user.otpExpiry = undefined;
        
        await user.save();
        
        // Generate token only after OTP verification
        generateTokenAndSetCookie(user._id, res);
        
        return res.status(200).json({
          message: "Email verified successfully",
          user: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified
          }
        });
     
      }
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({ message: "Internal server Error" });
    }
  };


export const signinController = async()=>{
    try{

    }catch(error){
        console.log("Error :",error);
        return res.status(500).json({ message:"Internal server Error"});
    }
}

export const signoutController = async()=>{
    try{

    }catch(error){
        console.log("Error :",error);
        return res.status(500).json({ message:"Internal server Error"});
    }
}


