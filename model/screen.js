const mongoose = require('mongoose');

const ScreenSchema = new mongoose.Schema({
    screenNumber: {
    type: String,
  },
  location: {
    type: Object,
    // required: true,
  },
  status: {
    type: String,
    // required: true,
  },
  locationType: {
    type: String,
    // required: true,
  },
  networkType: {
    type: String,
    // required: true,
  },
  city: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model('screens', ScreenSchema);