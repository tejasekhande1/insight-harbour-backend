const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User')

exports.postReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { rating, comment } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const user = req.user.id

        const review = new Review({
            product: productId,
            user,
            rating,
            comment
        });

        await review.save();

        product.reviews.push(review._id);
        await product.save();

        return res.status(201).json({
            success: true,
            message: 'Review posted successfully',
            data: review
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to post review',
            error: error.message
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const product = await Product.findById(review.product._id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const index = product.reviews.indexOf(reviewId);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Review not associated with the product'
            });
        }

        product.reviews.pull(reviewId);
        await product.save();

        await Review.findByIdAndDelete(reviewId);

        return res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message
        });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        await review.save();

        return res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: review
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update review',
            error: error.message
        });
    }
};

exports.getReviewsForProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const reviews = await Review.find({ product: productId });

        return res.status(200).json({
            success: true,
            message: 'Reviews retrieved successfully',
            data: reviews
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve reviews for product',
            error: error.message
        });
    }
};