const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    value: {
        type: Number, required: true, min: 1, max: 5
    }
});

module.exports = mongoose.model('Rating', ratingSchema);