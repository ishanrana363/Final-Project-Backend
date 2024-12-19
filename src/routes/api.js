const express = require('express');

const router = express.Router();
// user controller
const userCotroller = require("../controllers/userController");
// middleware
const { isLogIn, isAdmin, isUser } = require('../moddlewares/authMiddleware');

// product controller

const productController = require("../controllers/productController");
// rivewe controller
const reviewController = require("../controllers/reviewController");
// orderController 
const orderController = require("../controllers/orderController");
// statas controller
const statasController = require("../controllers/statasController");

// user related routes

router.post("/register", userCotroller.userRegistration);
router.post("/login", userCotroller.userLogin);
router.post("/logout", userCotroller.handleLogOut);
router.get("/all-users", isLogIn, isAdmin, userCotroller.getAllUsers);
router.delete("/delete-user/:id", isLogIn, isAdmin, userCotroller.deleteUser);
router.put("/update-user", isLogIn, userCotroller.updateUser);
router.put("/update-role/:id", isLogIn, isAdmin, userCotroller.updateUserRole);
router.get("/user-profile", isLogIn, userCotroller.userProfile);

// product related api

router.post("/create-product", isLogIn, isAdmin, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/single-product/:id", productController.getProductById);
router.put("/product-update/:id",isLogIn,isAdmin ,productController.updateProduct);
router.delete("/product-delete/:id",isLogIn,isAdmin,productController.deleteProduct);
router.get("/all-product", isLogIn , isAdmin , productController.allProducts);

// revicew related api

router.post("/post-review", isLogIn, reviewController.createReview);
router.get("/product-review",isLogIn, reviewController.getReviewsByUserId);
router.get("/total-review",isLogIn, reviewController.getReviewCount);

// payment related api

router.post("/create-checkout-session", orderController.makePayment );
router.post("/confirm-payment", orderController.confirmOrder  );
router.get("/all-orders/:email",isLogIn,orderController.getOrderByEmail);
router.get("/order-by-id/:id", isLogIn,orderController.getOrderByProductId);
router.get("/all-orders", isLogIn,isAdmin,orderController.allOrderByAdmin );
router.put("/order-update/:id", isLogIn,isAdmin ,orderController.orderStatusUpdate);
router.delete("/order-delete/:id", isLogIn,isAdmin,orderController.deleteOrder);

// statas related api

router.get("/user-status/:email", isLogIn, isUser, statasController.userStats);
router.get("/admin-status", isLogIn, isAdmin ,statasController.adminStatas);



module.exports = router;