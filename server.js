// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const router = require('./routes/router');

// // Load environment variables
// dotenv.config();

// // Initialize express
// const app = express();

// // Connect to Database
// connectDB();

// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/auth', router);

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const router = require('./routes/router');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// Enable CORS for any origin
app.use(cors());

// Routes
app.use('/api/auth', router);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

