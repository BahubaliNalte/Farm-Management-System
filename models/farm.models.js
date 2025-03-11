const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  soilType: {
    type: String,
    required: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('Farm', farmSchema);