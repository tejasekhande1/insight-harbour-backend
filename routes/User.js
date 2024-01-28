const express = require('express');
const router = express.Router();

const { signUp, login, changePassword } = require('../controllers/User')

router.post('/signup', signUp)
router.post("/login", login)
router.post("/changePassword", changePassword);

module.exports = router;
