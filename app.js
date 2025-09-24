import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json({ limit: "16kb" }))// to handle JSON payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));// to handle URL-encoded payloads

// CORS configuration   

app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowheaders: ['Content-Type', 'Authorization'],
})
);

import healthCheckRouter from './routes/healthcheckroute.js';
app.use('/api/v1/healthcheck', healthCheckRouter);// health check route


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
