import { Router } from "express";
import { healthCheck } from "../controllers/healthcheckcontroller.js"
import { registerUser } from "../controllers/authcontroller.js"

const router = Router();
router.route("/register").post(registerUser);


export default router;