const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.signUp = async (req, res) => {
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            confirmedPassword,
            role,
        } = req.body;

        if (
            !firstname ||
            !lastname ||
            !email ||
            !password ||
            !confirmedPassword
        ) {
            return res.status(400).json({
                success: false,
                message: `All fields are required`,
            });
        }

        if (password !== confirmedPassword) {
            return res.status(400).json({
                success: false,
                message: `Passwords not matched,please try again`,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `User already exists`,
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstname} ${lastname}`,
        });

        return res.status(200).json({
            status: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Signup failed",
            error: error
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: `Both fields are required`,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User not found`,
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                id: user._id,
                email: user.email,
                role: user.role,
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res.cookie("token", token, options);

            return res.status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Please enter correct password",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Error while logging user : ${error.message}`,
            error: error,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmedNewPassword } = req.body;

        if (newPassword !== confirmedNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirmed new password do not match.",
            });
        }

        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isOldPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Incorrect old password.",
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while changing password: ${error.message}`,
            error: error,
        });
    }
};