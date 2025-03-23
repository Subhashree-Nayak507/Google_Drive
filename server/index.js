import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

dotenv.config();
const app= express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({extended:true}));

app.use("/api/auth",authRouter);


const PORT= process.env.PORT || 4000;
app.listen(PORT,()=>{
    connectDB();
    console.log(`server running in http://localhost:${PORT}`)
})