const express = require('express');
const { loginUser, signupUser, googleLogin   } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/google', googleLogin);

module.exports = router;
