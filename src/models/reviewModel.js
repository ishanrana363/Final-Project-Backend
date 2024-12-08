const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    comments: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 200,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Matches mongoose.model("User", userSchema)
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Matches mongoose.model("Product", productSchema)
    },
}, {
    timestamps: true,
    versionKey: false,
});

const Review = model('Review', reviewSchema);

module.exports = Review;