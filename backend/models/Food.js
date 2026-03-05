const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodName: String,
  quantity: String,
  location: String,

  // ⭐ REAL LOCATION
  latitude: Number,
  longitude: Number,
postedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
  status: {
    type: String,
    default: "available",
  },

  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  otp: {
  type: String,
  default: null,
},


});

module.exports = mongoose.model("Food", foodSchema);
