const express = require('express');
const router = express.Router();

const { auth, isAdmin, isUser } = require('../middlewares/Auth')
const { addProduct, deleteProduct, updateProduct } = require('../controllers/Product')

router.post('/add', auth, isAdmin, addProduct)
router.delete('/delete/:productId', auth, isAdmin, deleteProduct)
router.put('/update/:productId', auth, isAdmin, updateProduct)

module.exports = router;