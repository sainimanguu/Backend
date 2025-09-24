import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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
        emailVerificationTokenExpiry: {
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


export const User = mongoose.model("User");// Export the model for use in other parts of the application