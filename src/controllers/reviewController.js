// post review

const productModel = require("../models/productModel");
const Review = require("../models/reviewModel");
const { successResponse, errorResponse } = require("../utility/response");

const createReview = async (req, res) => {
    try {
        const { comments, rating, userId, productId } = req.body;

        // Validate input
        if (!comments || !rating || !userId || !productId) {
            return errorResponse(res, 400, "All fields are required");
        }

        // Check for an existing review by the user for the product
        let existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            // Update existing review
            existingReview.comments = comments;
            existingReview.rating = rating;
            await existingReview.save();
        } else {
            // Create new review
            const newReview = new Review({ comments, rating, userId, productId });
            await newReview.save();
        }

        // Fetch all reviews for the product
        const reviews = await Review.find({ productId });
        if (reviews.length > 0) {
            // Calculate average rating
            const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
            const avgRating = totalRating / reviews.length;

            // Update product rating
            const product = await productModel.findById(productId);
            if (product) {
                product.rating = avgRating;
                await product.save({ validateBeforeSave: false });
            }
        }

        return successResponse(res, existingReview ? 200 : 201, "Review saved successfully", reviews);
    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error.message || error);
    }
};

// review by userId

const getReviewsByUserId = async (req, res) => {
    const userId = req.headers.id;
    try {

        // Validate input
        if (!userId) {
            return errorResponse(res, 400, "User ID is required");
        }

        // Fetch all reviews by the user
        const reviews = await Review.find({ userId });

        // Handle case where no reviews are found
        if (!reviews || reviews.length === 0) {
            return successResponse(res, 200, "No reviews found for this user", []);
        }

        return successResponse(res, 200, "Reviews fetched successfully", reviews);
    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error.message || error);
    }
};

// review count api

const getReviewCount = async (req, res) => {
    try {
        const totalReview = await Review.countDocuments({});
        return successResponse(res, 200, "Review count fetched successfully",totalReview);
    } catch (error) {
        return errorResponse(res, 500, "Something went wrong", error.message);
    }
};



module.exports = { createReview, getReviewsByUserId,getReviewCount };