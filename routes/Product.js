const express = require('express');
const router = express.Router();

const { auth, isAdmin, isUser } = require('../middlewares/Auth')
const { addProduct, deleteProduct, updateProduct, getProductsByCategory, searchProducts, getAllProducts, searchProductsByCategory, getProductsByBrandName } = require('../controllers/Product')

router.post('/add', auth, isAdmin, addProduct);
router.delete('/delete/:productId', auth, isAdmin, deleteProduct);
router.put('/update/:productId', auth, isAdmin, updateProduct);

router.get('/search', auth, isUser, searchProducts);
router.get('/:category', auth, isUser, getProductsByCategory);
router.get('/:category/search', auth, isUser, searchProductsByCategory);
router.get('/brand/:brandName', auth, isUser, getProductsByBrandName)
router.get('/', auth, isUser, getAllProducts);

module.exports = router;