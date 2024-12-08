const productModel = require("../models/productModel");
const reviewModel = require("../models/reviewModel");
const { successResponse, errorResponse } = require("../utility/response");

// Create a new product

const createProduct = async (req, res) => {
    try {
        // Validate the existence of the author ID in headers
        const authorId = req.headers.id;
        if (!authorId) {
            return errorResponse(res, 400, "Author ID is required in headers.");
        }

        // Create a new product instance with author ID
        const newProduct = new productModel({
            ...req.body,
            author: authorId, // Assign the author ID from headers
        });

        // Save the product to the database
        const savedProduct = await newProduct.save();

        // Calculate average rating based on reviews
        const reviews = await reviewModel.find({ productId: savedProduct._id });

        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const avgRating = totalRating / reviews.length;

            // Update the product with the calculated rating
            savedProduct.rating = avgRating;
            await savedProduct.save();
        } else {
            // If no reviews, set the rating to a default value (e.g., 0 or null)
            savedProduct.rating = 0;
            await savedProduct.save();
        }

        // Return success response
        return successResponse(res, 201, "Product saved successfully", savedProduct);
    } catch (error) {
        // Handle any errors
        return errorResponse(res, 500, "Product save failed", error);
    }
};

// Get all products

const getAllProducts = async (req, res) => {
    try {
        const { category, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (category && category !== "all") {
            filter.category = category;
        }
        if (color && color !== "all") {
            filter.color = color;
        }
        if (minPrice && maxPrice) {
            const min = parseFloat(minPrice);
            const max = parseFloat(maxPrice);
            if (!isNaN(min) && !isNaN(max)) {
                filter.price = { $gte: min, $lte: max };
            }
        }

        const skip = ( parseInt(page)-1) * parseInt(limit);

        const totalProducts = await productModel.countDocuments(filter);

        const totalPages = Math.ceil(totalProducts / parseInt(limit));

        const products = await productModel.find(filter).skip(skip).limit(parseInt(limit)).populate("author",'username eamil ');


        successResponse(res, 200, "Find all products", data={
            products,
            totalProducts,
            totalPages
        } );
    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error);
    }
};


module.exports = { createProduct,getAllProducts };