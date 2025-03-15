import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDb.js";

dotenv.config();
const app= express();




const PORT= process.env.PORT || 4000;
app.listen(PORT,()=>{
    connectDB();
    console.log(`server running in http://localhost:${PORT}`)
})