import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()//it checks if the input is a valid email address
            .withMessage("Invalid email address"),//it is used to specify the error message that will be returned if the validation fails

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username is must be in lowercase")
            .isLength({ min: 3, max: 20 })
            .withMessage("Username must be between 3 and 20 characters"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),

        body("fullname")
            .optional()
            .trim()


    ]
};

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is required"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")


    ]
};




export { userRegisterValidator, userLoginValidator }