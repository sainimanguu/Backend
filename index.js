import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./db/index.js";


const port = process.env.PORT || 3000;

dotenv.config({
    path: "./.env",
});// Load environment variables from .env file

app.get('/', (req, res) => {
    res.send('Hello World!');
});

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Example app listening on port http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error", err);
        process.exit(1);
    });





