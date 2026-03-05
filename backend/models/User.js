const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  role: {
    type: String,
    enum: ["donor", "receiver"],
    default: "receiver",
  },

  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model("User", userSchema);