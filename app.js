import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRegisterValidator } from './validators/index.js';


const app = express();


app.use(express.json({ limit: "16kb" }))// to handle JSON payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));// to handle URL-encoded payloads
app.use(express.static("public"));

app.use(cookieParser())

// CORS configuration   

app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowheaders: ['Content-Type', 'Authorization'],
})
);

import healthCheckRouter from './routes/healthcheckroute.js';
import authRouter from './routes/authroute.js';
import { userRegisterValidator } from './validators/index.js';
app.use('/api/v1/healthcheck', healthCheckRouter);// health check route
app.use('/api/v1/auth/register', userRegisterValidator(), authRouter)



export default app;