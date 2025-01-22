const express = require('express');
const { loginUser, signupUser, googleLogin, updateUserLocation, sendOtp, verifyOtp   } = require('../controllers/authController');
const { getScreen } = require('../controllers/screenController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/google', googleLogin);
router.get('/getScreen',getScreen)
router.put('/addlocation',updateUserLocation)
router.post('/send-otp',sendOtp)
router.post('/verify-otp',verifyOtp)

module.exports = router;
