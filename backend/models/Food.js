const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodName: String,
  quantity: String,
  location: String,
  latitude: Number,
  longitude: Number,

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  donorName: String,

  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  receiverName: String,

  status: {
    type: String,
    default: "available",
  },

  otp: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Food", foodSchema);