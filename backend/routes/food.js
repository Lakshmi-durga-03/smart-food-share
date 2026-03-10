const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const User = require("../models/User");

// CREATE FOOD
router.post("/food", async (req, res) => {
  try {
    const { foodName, quantity, location, latitude, longitude, postedBy } = req.body;

    const donor = await User.findById(postedBy);

<<<<<<< HEAD
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

=======
   const newFood = new Food({
  foodName,
  quantity,
  location,
  latitude,
  longitude,
  postedBy: req.body.postedBy, // ✅ FIXED
  status: "available",
  otp: null,
});
>>>>>>> upstream/main
    await newFood.save();

    res.json({ message: "Food posted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET FOODS
router.get("/food", async (req, res) => {
<<<<<<< HEAD
  const foods = await Food.find();
  res.json(foods);
=======
  try {
    const foods = await Food.find();

// 🔄 Auto-expire logic
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
>>>>>>> upstream/main
});

// REQUEST FOOD
router.post("/food/request/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const food = await Food.findById(req.params.id);
<<<<<<< HEAD
    if (!food) return res.status(404).json({ message: "Food not found" });

    const receiver = await User.findById(userId);
=======
    // 🚫 Prevent requesting own food
if (food.postedBy && food.postedBy.toString() === userId) {
  return res.status(400).json({ message: "You cannot request your own food" });
}

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    // 🚫 Prevent duplicate request
if (food.status !== "available") {
  return res.status(400).json({ message: "Food is not available" });
}

    // ⭐ GENERATE OTP HERE
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
>>>>>>> upstream/main

    food.status = "requested";
    food.requestedBy = userId;
    food.receiverName = receiver?.name;

    await food.save();

    res.json({ message: "Food requested successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
module.exports = router;
=======
// ================= COLLECT FOOD (OTP VERIFY) =================
router.post("/food/collect/:id", async (req, res) => {
  try {
    const { otp } = req.body;

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // OTP CHECK
    if (food.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (food.status !== "requested") {
  return res.status(400).json({ message: "Food is not in requested state" });
}

    food.status = "collected";
    food.otp = null; // remove OTP after use

    await food.save();
     const io = req.app.get("io");
    io.emit("foodUpdated");


    res.json({ message: "Food collected successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
>>>>>>> upstream/main
