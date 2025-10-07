import { Router } from "express";
import {
    registerUser,
    login,
    logoutUser,
    getcurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAcessToken,
    forgotPasswordRequest,
    resetPassword,
    changeCurrentPassword
} from "../controllers/authcontroller.js"

import { validate } from "../middleware/validator.js"
import { userRegisterValidator, userLoginValidator, userForgotPasswordValidator } from "../validators/index.js"
import { verifyjwt } from "../middleware/authmiddleware.js"

const router = Router();

//unsecured routes
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router.route("/reset-password/resetToken").post(userForgotPasswordValidator(), validate, resetPassword);


//secure routes
router.route("/logout").post(verifyjwt, logoutUser)
router.route("/current-user").post(verifyjwt, getcurrentUser,);
router.route("/change-password").post(verifyjwt, userForgotPasswordValidator(), validate, changeCurrentPassword);
router.route("/resend-verification-email").post(verifyjwt, resendEmailVerification);



export default router;