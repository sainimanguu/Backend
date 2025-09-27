import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
    {
        avatar: {
            type: {
                url: String,
                localPath: String,
            },
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        fullname: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],// Password is required
            minlength: [6, "Password must be at least 6 characters long"],// Minimum length of 6 characters
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshTokens: {
            type: [String],
        },
        forgotPasswordToken: {
            type: String,
        },
        forgotPasswordTokenExpiry: {
            type: Date,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre("save", async function (next) {
    if (!isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAcessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
    },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY },
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
    },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY }

    )
}


userSchema.methods.generateTemporaryToken = function () {
    crypto.randomBytes(32).toString("hex");// Generate a random token to String is hexadecimal format

    const unHashedToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");

    const tokenExpiry = Date.now() + 20 * (60 * 1000);// Token valid for 20 minutes
    return { unHashedToken, hashedToken, tokenExpiry };


}

export const User = mongoose.model("User", userSchema);// Export the model for use in other parts of the application