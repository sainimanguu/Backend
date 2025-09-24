import { User } from "../models/user.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from '../utils/asynchandler.js';

const registerUser = asyncHandler(async (req, res, next) => {
    const { email, username, password, role } = req.body;

    User.findOne({
        $or: [{ email }, { username }]
    })
})