const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require('../utility/response');
require("dotenv").config();
const userRegistration = async (req, res) => {
    try {
        let { username, email, profile_img, bio, profassion, password } = req.body;
        const hashedPassword = await bcrypt.hashSync(password, 10);
        const existsUser = await userModel.findOne({ email: email });
        if (existsUser) return res.status(400).json({ message: 'User already exists' });
        const newUser = new userModel({ username, email, profile_img, bio, profassion, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ status: "success", msg: 'User registered successfully', data: newUser });

    } catch (error) {
        res.status(500).json({
            status: 'fail',
            msg: error.message
        })
    }
};

// user login controller

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            bio: user.bio,
            profassion: user.profassion,
            role: user.role


        }
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.cookie("token", token, {
            maxAge: 1 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.json({
            status: 'success',
            msg: 'User logged in successfully',
            token: token,
            user: userData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'fail',
            msg: error.message
        })
    }
};

// lgout controller
const handleLogOut = async (req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({
            status:"success",
            msg : "User logout successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status:"fail",
            msg : e.toString()
        });
    }
};

// all users

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({},'username email profileImg bio profassion role ').sort({createdAt : -1});
        successResponse(res,200,"find all users",users);
    } catch (error) {
        errorResponse(res,500,"something went wrong",error)
    }
};

// delete users

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) return errorResponse(res,404,"user not found")
        return successResponse(res,200,"user deleted successfully ",user)
    } catch (error) {
        return errorResponse(res,500,"something went wrong",error);
    }
};

module.exports = {userRegistration, userLogin,handleLogOut,getAllUsers,deleteUser};