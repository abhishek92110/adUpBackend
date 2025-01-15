const mongoose = require('mongoose');

// const ScreenSchema = new mongoose.Schema({
//     screenNumber: {
//     type: String,
//   },
//   location: {
//     type: Object,
//     // required: true,
//   },
//   status: {
//     type: String,
//     // required: true,
//   },
//   locationType: {
//     type: String,
//     // required: true,
//   },
//   networkType: {
//     type: String,
//     // required: true,
//   },
//   city: {
//     type: String,
//     // required: true,
//   },
// });

const ScreenSchema = new mongoose.Schema({
  screenNumber: Number,
  location: Object,
  status: String,
  locationType: String,
  networkType: String,
  city: String,
  coordinate: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  }
});

// Create a 2dsphere index on the 'coordinate' field
ScreenSchema.index({ coordinate: '2dsphere' });

module.exports = mongoose.model('screens', ScreenSchema);