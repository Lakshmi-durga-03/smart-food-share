const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const User = require("../models/User");

// CREATE FOOD
router.post("/food", async (req, res) => {
  try {
    const { foodName, quantity, location, latitude, longitude, postedBy } = req.body;

    const donor = await User.findById(postedBy);

    const newFood = new Food({
      foodName,
      quantity,
      location,
      latitude,
      longitude,
      postedBy,
      donorName: donor?.name,
      status: "available",
      otp: null,
    });

    await newFood.save();

    res.json({ message: "Food posted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET FOODS
router.get("/food", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

// REQUEST FOOD
router.post("/food/request/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const receiver = await User.findById(userId);

    food.status = "requested";
    food.requestedBy = userId;
    food.receiverName = receiver?.name;

    await food.save();

    res.json({ message: "Food requested successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;