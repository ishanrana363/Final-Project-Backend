const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
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

module.exports = {userRegistration};