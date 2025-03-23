import User from "../models/auth.model.js";
import { generateOTP, sendOTPEmail } from "../utils/otp/otp.js";
import { generateTokenAndSetCookie } from "../utils/Token/token.js";
import bcrypt from "bcryptjs";

export const signupController = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Please fill up all fields"
    });
  }
    try {
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
        // console.log("user given",user.otp);
        // console.log("set",otp)
        
        if (user.otp.trim() !== otp.trim()) {
          return res.status(400).json({ message: "Invalid OTP" });
        }
        
        if (new Date() > user.otpExpiry) {
          return res.status(400).json({ message: "OTP has expired" });
        }
        
        user.isVerified = true;
        user.otp = undefined; 
        user.otpExpiry = undefined;
        
        await user.save();
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


export const signinController = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "Please fill up all fields"
    });
  }
    try {
      if (!req.body.otp) {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
          return res.status(400).json({
            message: "Fill up all fields"
          });
        }
        
        const user = await User.findOne({ 
          $or: [{ username }, { email }]
        });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          return res.status(400).json({ error: "Invalid password" });
        }

        if (!user.isVerified) {
          const otp = generateOTP();
          const otpExpiry = new Date();
          otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
          
          user.otp = otp;
          user.otpExpiry = otpExpiry;
          
          await sendOTPEmail(email, otp);
          await user.save();
          
          return res.status(200).json({
            message: "Please verify your account with the OTP sent to your email",
            user: {
              _id: user._id,
              username: user.username,
              email: user.email
            }
          });
        }

        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
          message: "Signed in successfully",
          user: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified
          }
        });
      } 
      else {
        const { otp, email } = req.body;
        if (!email || !otp) {
          return res.status(400).json({ message: "Email and OTP are required" });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
      
        if (user.otp.trim() !== otp.trim()) {
          return res.status(400).json({ message: "Invalid OTP" });
        }
        
        if (new Date() > user.otpExpiry) {
          return res.status(400).json({ message: "OTP has expired" });
        }
        
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        
        await user.save();
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
      console.log("Error:", error.message);
      console.log("Stack trace:", error.stack);
      return res.status(500).json({ message: "Internal server Error" });
    }
  };

export const signoutController = async(req,res)=>{
    try{
      const userId = req.user._id; 
      await User.findByIdAndUpdate(userId, { 
        isVerified: false
      });
      
      res.clearCookie("jwt");
      
      return  res.status(200).json({ message:"logout successfully"});
    }catch(error){
        console.log("Error :",error);
        return res.status(500).json({ message:"Internal server Error"});
    }
}

export const checkauth = async(req,res)=>{
  try{
  const user= req.user;
       return res.status(200).json({ message:"authorized user",
       user
   });
  }catch(error){
      console.log("Error :",error);
       return res.status(500).json({ message:"Internal server Error"});
  }
};


