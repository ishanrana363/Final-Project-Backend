const express = require('express');

const router = express.Router();
// user controller
const userCotroller = require("../controllers/userController");
const { isLogIn, isAdmin } = require('../moddlewares/authMiddleware');

// user related routes

router.post("/register", userCotroller.userRegistration);

router.post("/login", userCotroller.userLogin );

router.post("/logout", userCotroller.handleLogOut);

router.get("/all-users",isLogIn,isAdmin,userCotroller.getAllUsers);

router.delete("/delete-user/:id", isLogIn,isAdmin, userCotroller.deleteUser);

// router.get("/profile", userCotroller.getProfile);


module.exports = router;