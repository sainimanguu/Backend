import { User } from "../models/user.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from '../utils/asynchandler.js';
import { sendEmail,emailVerificationMailgenContent } from '../utils/mail.js'

const generateAcessandRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        user.generateAcessToken;
        user.generateRefreshToken;

        user.refreshToken = refreshToken;
        await user.save({
            validatebeforeSave: false,
        });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens", [error]);
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    const { email, username, password, role } = req.body;

    User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(400, "User with this email or username already exists", []);
    }

    const user = User.create({
        email,
        username,
        password,
        isEmailVerified: false,
    });

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save(
        { validatebeforeSave: false, }
    )

    await sendEmail({
        email: user?.email,//? is used to check if user is not null or undefined
        subject: "Please Verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,

        )
    })

})