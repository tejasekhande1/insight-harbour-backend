const express = require('express');
const router = express.Router();

const { signUp, login, changePassword } = require('../controllers/User')
const { auth, isAdmin, isUser } = require('../middlewares/Auth')

router.post('/signup', signUp)
router.post("/login", login)
router.post("/changePassword", auth, changePassword);

module.exports = router;
