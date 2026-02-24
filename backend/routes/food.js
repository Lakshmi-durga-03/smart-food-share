const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

// ================= CREATE FOOD =================
router.post("/food", async (req, res) => {
  try {
    const { foodName, quantity, location, latitude, longitude } = req.body;

    const newFood = new Food({
      foodName,
      quantity,
      location,
      latitude,
      longitude,
      status: "available",
      otp: null,
    });

    await newFood.save();

    res.json({ message: "Food posted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= GET FOODS =================
router.get("/food", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= REQUEST FOOD =================
router.post("/food/request/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // ⭐ GENERATE OTP HERE
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    food.status = "requested";
    food.requestedBy = userId;
    food.otp = otp;

    await food.save();
       

    // SOCKET NOTIFICATION
    const io = req.app.get("io");

io.emit("foodRequested", {
  message: `Someone requested ${food.foodName}`,
});

io.emit("foodUpdated");

    res.json({
      message: "Food requested successfully",
      otp: food.otp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
