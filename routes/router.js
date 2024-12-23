const express = require('express');
const { loginUser, signupUser, googleLogin   } = require('../controllers/authController');
const { getScreen } = require('../controllers/screenController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/google', googleLogin);
router.get('/getScreen',getScreen)

module.exports = router;
