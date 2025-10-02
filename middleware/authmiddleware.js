import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asynchandler.js'
import jwt from 'jsonwebtoken';

export const verifyjwt = asyncHandler(async (req, res, next) => {
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

    if (!token) {
        throw new ApiError(401, "Not authorized to access this route")
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

        if (!user) {
            throw new ApiError(401, "Invalid Token");
        }
        req.user = user;
        next()
    }
    catch (error) {
        throw new ApiError(401, "Invalid Token");
    }
})