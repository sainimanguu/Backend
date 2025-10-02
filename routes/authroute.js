import { Router } from "express";
import { logoutUser, registerUser } from "../controllers/authcontroller.js"
import { login } from "../controllers/authcontroller.js"
import { validate } from "../middleware/validator.js"
import { userRegisterValidator, userLoginValidator } from "../validators/index.js"
import { verifyjwt } from "../middleware/authmiddleware.js"

const router = Router();
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/logout").post(verifyjwt, logoutUser)


export default router;