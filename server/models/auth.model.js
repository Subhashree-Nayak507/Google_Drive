import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		fullName: {
			type: String
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		isVerified:{
			type:Boolean,
			default:false
		},
		otp: {
			type: String,
			default: null,
		  },
		otpExpiry: {
			type: Number,
			default: null,
		  },
	},
	{ timestamps: true }
);

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return 
    this.password = await bcrypt.hash(this.password, 10);
});
const User = mongoose.model("User", userSchema);

export default User;