const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();


// Initialize Firebase Admin SDK with service account
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)),
});

module.exports = admin;
