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
  const { email, name, business, phone } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({
      email,
      name,
      business,
      phone
    });

    // Save user to database
    await user.save();

    // Generate JWT token for new user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  }
   catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// update location in user
const updateUserLocation = async (req, res) => {
  const { email, location } = req.body;

  try {
    // Check if user exists (optional, but recommended)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's location
    const result = await User.updateOne(
      { email },
      { $set: { location } }
    );

    if (result.nModified === 0) {
      return res.status(400).json({ message: 'No changes made' });
    }

    // Generate a token if necessary (make sure this logic is here)
   

    res.status(200).json({ "status":"true" }); // return token or success message
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// google login

// const googleLogin = async (req, res) => {
//   console.log("google token")

//   const { idToken } = req.body;  // ID Token sent from frontend

//   try {
//     // Verify the Firebase ID token
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     console.log("decode  =",decodedToken)

//     // Check if the user already exists in the database
//     let user = await User.findOne({ email: decodedToken.email });
//     if (!user) {
//       // If the user does not exist, create a new user
//       user = new User({
//         email: decodedToken.email,
//         name: decodedToken.name || decodedToken.email,  // Name or email as fallback
//       });
//       await user.save();
//     }

//     // Generate JWT token for the user
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     // Respond with the generated JWT token
//     res.json({ token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// };

const googleLogin = async (req, res) => {
  console.log("google token")

  const { email, name } = req.body; 

  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      // If the user does not exist, create a new user
      user = new User({
        email: email,
        name: name 
      });
      await user.save();
    }

    // Generate JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


module.exports = { loginUser, signupUser, googleLogin, updateUserLocation  };
