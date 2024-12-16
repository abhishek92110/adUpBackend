const User = require('../model/user');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// signUp user

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({
      email,
      password,
    });

    // Save user to database
    await user.save();

    // Generate JWT token for new user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


// google login

const googleLogin = async (req, res) => {
  console.log("google token")
  const { idToken } = req.body;  // ID Token sent from frontend

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("decode  =",decodedToken)

    // Check if the user already exists in the database
    let user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      // If the user does not exist, create a new user
      user = new User({
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email,  // Name or email as fallback
      });
      await user.save();
    }

    // Generate JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Respond with the generated JWT token
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = { loginUser, signupUser, googleLogin  };
