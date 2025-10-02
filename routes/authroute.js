import { Router } from "express";
import { registerUser } from "../controllers/authcontroller.js"
import { login } from "../controllers/authcontroller.js"
import { validate } from "../middleware/validator.js"
import { userRegisterValidator, userLoginValidator } from "../validators/index.js"

const router = Router();
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);


export default router;