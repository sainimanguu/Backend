import { Router } from "express";
import { healthCheck } from "../controllers/healthcheckcontroller.js"
import { registerUser } from "../controllers/authcontroller.js"
import { validate } from "../middleware/validator.js"
import { userRegisterValidator } from "../validators/index.js"

const router = Router();
router.route("/register").post(registerUser);


export default router;