import { Router } from "express";
import { healthCheck } from "../controllers/healthcheckcontroller.js"
import { registerUser, loggedInUser } from "../controllers/authcontroller.js"
import { validate } from "../middleware/validator.js"
import { userRegisterValidator } from "../validators/index.js"

const router = Router();
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(login);


export default router;