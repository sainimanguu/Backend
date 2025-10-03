import { User } from '../models/user.model.js'
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { sendEmail, emailVerificationMailgenContent } from '../utils/mail.js'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { use } from 'react';

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
    }
    catch (error) {
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
            `${req.protocol}://${req.get("host")}/api/v1/verify-email/${unHashedToken}`// Link to verify email
        )
    });
    await user.findById(user._id).select("-password -refreshTokens -__v -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationExpiry");// Exclude sensitive fields

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user",);
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { user: createdUser },
                "User registered successfully. Please check your email to verify your account."
            ))
})

const login = asyncHandler(async (req, res, next) => {
    const { email, password, username } = req.body;

    if ((!email || !username)) {
        throw new ApiError(400, "Email or username and password are required", []);// Bad request
    }


    const user = await User.findOne({ email })
    if ((!user)) {
        throw new ApiError(400, "User not exist", []);
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if ((!isPasswordValid)) {
        throw new ApiError(400, "Not valid Pass", []);
    }

    const { accessToken, refreshToken } = await generateAcessandRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -__v -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationExpiry",
    );

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
});

const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshTokens: ""
            }
        },
        {
            new: true,
        },
    );
    const options = {
        httpOnly: true,// Not accessible by client-side scripts
        secure: true,
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            status: 200,
            message: "User logged out successfully",
            data: null,
        })
});

const getcurrentUser = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "Current User fetched"
        ))
})

const verifyEmail = asyncHandler(async (req, res, next) => {
    const { verificationToken } = req.params

    if (!verificationToken) {
        throw new ApiError(400, "Email Verification token is required", []);
    }

    let hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: { $gt: Date.now() },// Check if token is not expired

    })

    if (!user) {
        throw new ApiError(400, "Invalid or expired email verification token", []);
    }
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;// Remove token and expiry after verification

    user.isEmailVerified = true;
    await user.save({ validatebeforeSave: false, });

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                isEmailVerified: true,
            },
            "Email verified successfully"
        ))
})

const resendEmailVerification = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User not found", []);
    }
    if (user.isEmailVerified) {
        throw new ApiError(400, "Email is already verified", []);
    }


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
            `${req.protocol}://${req.get("host")}/api/v1/verify-email/${unHashedToken}`// Link to verify email
        )
    });

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Verification email sent successfully. Please check your email."
        ))
});

const refreshAcessToken = asyncHandler(async (req, res, next) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingrefreshToken) {
        throw new ApiError(401, "Refresh token is required", []);
    }

    try {
        const decodedToken = jwt.verify(incomingrefreshToken, process.env.JWT_REFRESH_SECRET, async(err, decoded))

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(404, "User not found", []);
        }

        if (incomingrefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired", []);
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, refreshToken, newRefreshToken } = await generateAcessandRefreshTokens(user._id)
        user.refreshToken = newRefreshToken;
        await user.save();

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed successfully"
                )
            )

    }


    catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }
})



export {
    registerUser,
    login,
    logoutUser,
    getcurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAcessToken,
};