const User = require('../model/user');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const twilio = require('twilio');


const accountSid = process.env.ACCOUNT_SID; // Replace with your Twilio SID
const authToken =  process.env.AUTH_TOKEN; // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);

// route to otp verification

const sendOtp = (req, res) => {
  const { phoneNumber } = req.body;
  
  // Twilio sender phone number (replace with your own Twilio phone number)
  const senderNumber = '+15076783933';  // Replace with your Twilio phone number

  client.verify.services('VAb3d86a0cc4362e6b0f71a47064ecdc71')
    .verifications.create({
      to: `+91${phoneNumber}`,
      from: senderNumber,  // Specify the sender number
      channel: 'sms'
    })
    .then((verification) => res.json({ success: true, verification }))
    .catch((error) => res.json({ success: false, error: error.message }));
};

const verifyOtp =  (req, res) => {
  const { phoneNumber, otp } = req.body;

  client.verify.services('YOUR_VERIFICATION_SERVICE_SID')
    .verificationChecks.create({ to: `+91${phoneNumber}`, code: otp })
    .then((verification_check) => {
      if (verification_check.status === 'approved') {
        res.json({ success: true });
      } else {
        res.json({ success: false, error: 'Invalid OTP' });
      }
    })
    .catch((error) => res.json({ success: false, error: error.message }));
};

// end route to otp verification

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
  console.log("body data", req.body, email, name, business, phone)

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


module.exports = { loginUser, signupUser, googleLogin, updateUserLocation, verifyOtp, sendOtp  };
