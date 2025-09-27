import app from "./app.js";
import dotenv from 'dotenv';


const port = process.env.PORT || 3000;

dotenv.config({
    path: "./.env",
});// Load environment variables from .env file

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})




