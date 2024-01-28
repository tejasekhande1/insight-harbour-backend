const User = require("../models/User");
const bcrypt = require('bcrypt');

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

        const saltRounds = 10; // Recommended number of salt rounds
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
