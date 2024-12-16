const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const { successResponse, errorResponse } = require("../utility/response");



const userStats =async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return errorResponse(res, 400, "Email is required")
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return errorResponse(res, 404, "User not found")
        }

        // total payments
        const totalPaymentsResult = await orderModel.aggregate([
            { $match: { email: email } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ])

        const totalPaymentsAmount = totalPaymentsResult.length > 0 ? totalPaymentsResult[0].totalAmount : 0

        // total reviews
        const totalReviews = await Review.countDocuments({ userId: user._id })

        const purchasedProductsIds = await orderModel.distinct("products.productId", { email: email });
        const totalPurchadedProducts = purchasedProductsIds.length;

        return successResponse(res, 200, "Fetched User stats successfully", {
            totalPayments: Number(totalPaymentsAmount.toFixed(2)),
            totalReviews,
            totalPurchadedProducts
        })


    } catch (error) {
        return errorResponse(res, 500, "Couldn't get user stats", error)
    }
}



// admin stats
const adminStatas = async (req, res) => {
    try {
        // Count total orders
        const totalOrders = await orderModel.countDocuments();

        // Count total products
        const totalProducts = await productModel.countDocuments();

        // Count total reviews
        const totalReviews = await Review.countDocuments();

        // Count total users
        const totalUsers = await User.countDocuments();

        // Calculate total earnings by summing the 'amount' of all orders
        const totalEarningsResult = await orderModel.aggregate([

            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$amount" },
                },
            },
        ]);

        const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;

        // Calculate monthly earnings by summing the 'amount' of all orders grouped by month
        const monthlyEarningsResult = await orderModel.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    monthlyEarnings: { $sum: "$amount" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
        ]);

        // Format the monthly earnings data for easier consumption on the frontend
        const monthlyEarnings = monthlyEarningsResult.map(entry => ({
            month: entry._id.month,
            year: entry._id.year,
            earnings: entry.monthlyEarnings,
        }));

        // Send the aggregated data
        res.status(200).json({
            totalOrders,
            totalProducts,
            totalReviews,
            totalUsers,
            totalEarnings,
            monthlyEarnings,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
};



module.exports = {
    userStats,
    adminStatas
};