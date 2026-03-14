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
  try {
    const foods = await Food.find();

    // Auto-expire logic
    for (let food of foods) {
      if (food.expiryTime && new Date() > food.expiryTime && food.status === "available") {
        food.status = "expired";
        await food.save();
      }
    }

    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REQUEST FOOD
router.post("/food/request/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Prevent requesting own food
    if (food.postedBy && food.postedBy.toString() === userId) {
      return res.status(400).json({ message: "You cannot request your own food" });
    }

    // Prevent duplicate request
    if (food.status !== "available") {
      return res.status(400).json({ message: "Food is not available" });
    }

    const receiver = await User.findById(userId);

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    food.status = "requested";
    food.requestedBy = userId;
    food.receiverName = receiver?.name;
    food.otp = otp;

    await food.save();

    res.json({ message: "Food requested successfully", otp });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// COLLECT FOOD (OTP VERIFY)
router.post("/food/collect/:id", async (req, res) => {
  try {
    const { otp } = req.body;

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.status !== "requested") {
      return res.status(400).json({ message: "Food is not in requested state" });
    }

    if (food.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    food.status = "collected";
    food.otp = null;

    await food.save();

    const io = req.app.get("io");
    io.emit("foodUpdated");

    res.json({ message: "Food collected successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;