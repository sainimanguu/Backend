import { Router } from "express";
import { healthCheck } from "../controllers/healthcheckcontroller.js"
import { registerUser } from "../controllers/authcontroller.js"

const router = Router();
router.route("/register").post(registerUser);// Define a POST route on `/register`


export default router;