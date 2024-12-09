const express = require('express');

const router = express.Router();
// user controller
const userCotroller = require("../controllers/userController");
// middleware
const { isLogIn, isAdmin } = require('../moddlewares/authMiddleware');

// product controller

const productController = require("../controllers/productController");
// rivewe controller
const reviewController = require("../controllers/reviewController");

// user related routes

router.post("/register", userCotroller.userRegistration);

router.post("/login", userCotroller.userLogin);

router.post("/logout", userCotroller.handleLogOut);

router.get("/all-users", isLogIn, isAdmin, userCotroller.getAllUsers);

router.delete("/delete-user/:id", isLogIn, isAdmin, userCotroller.deleteUser);

router.put("/update-user", isLogIn, userCotroller.updateUser);

router.put("/update-role/:id", isLogIn, isAdmin, userCotroller.updateUserRole)

// product related api

router.post("/create-product", isLogIn, isAdmin, productController.createProduct);

router.get("/", productController.getAllProducts);

router.get("/single-product/:id", productController.getProductById);
router.put("/product-update/:id",isLogIn,isAdmin ,productController.updateProduct)

// revicew related api

router.post("/post-review", isLogIn, reviewController.createReview);
router.get("/product-review",isLogIn, reviewController.getReviewsByUserId);
router.get("/total-review",isLogIn, reviewController.getReviewCount);

module.exports = router;