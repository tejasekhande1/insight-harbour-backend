const express = require('express');
const router = express.Router();

const { auth, isAdmin, isUser } = require('../middlewares/Auth')
const { addProduct, deleteProduct, updateProduct, getProductsByCategory, searchProducts, getAllProducts, searchProductsByCategory, getProductsByBrandName, getTopRatedProducts } = require('../controllers/Product');
const { postReview, deleteReview, updateReview, getReviewsForProduct } = require('../controllers/Review');

router.post('/add', auth, isAdmin, addProduct);
router.delete('/:productId', auth, isAdmin, deleteProduct);
router.put('/:productId', auth, isAdmin, updateProduct);

router.get('/search', auth, isUser, searchProducts);
router.get('/:category', auth, isUser, getProductsByCategory);
router.get('/:category/search', auth, isUser, searchProductsByCategory);
router.get('/brand/:brandName', auth, isUser, getProductsByBrandName)
router.get('/top', auth, isUser, getTopRatedProducts)

router.post('/:productId/review/', auth, isUser, postReview)
router.delete('/:productId/review/:reviewId', auth, isUser, deleteReview)
router.put('/:productId/review/:reviewId', auth, isUser, updateReview)
router.get('/:productId/review', auth, isUser, getReviewsForProduct)
router.get('/', auth, isUser, getAllProducts);


module.exports = router;