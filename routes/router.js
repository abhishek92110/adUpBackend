const express = require('express');
const { loginUser, signupUser, googleLogin, updateUserLocation   } = require('../controllers/authController');
const { getScreen } = require('../controllers/screenController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/google', googleLogin);
router.get('/getScreen',getScreen)
router.get('/addlocation',updateUserLocation)

module.exports = router;
