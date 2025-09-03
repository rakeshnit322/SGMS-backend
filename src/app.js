import express from "express";

import cors from "cors";

import dotenv from "dotenv";
dotenv.config({ path: './.env' });


const app = express();


app.use(express.json());

app.use(cors({
    origin: process.env.CORS_ORGIN || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public')); 



app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running'
    });
});



//routes
import studentRouter from "./routes/student.routes.js"

app.use("/api/students", studentRouter);




app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";

    console.log("Error here :: ",err);
    
    return res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message,
        errors: err.errors || []
    });
});


export default app;