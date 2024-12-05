const express = require('express');

const router = express.Router();
// user controller
const userCotroller = require("../controllers/userController");

// user related routes

router.post("/register", userCotroller.userRegistration);

router.post("/login", userCotroller.userLogin );

router.post("/logout", userCotroller.handleLogOut);

router.get("/all-users", userCotroller.getAllUsers);

// router.get("/profile", userCotroller.getProfile);


module.exports = router;