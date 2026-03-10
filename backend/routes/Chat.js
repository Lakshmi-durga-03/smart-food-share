const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

// GET chat history
router.get("/chat/:roomId", async (req, res) => {
  try {
    const chats = await Chat.find({
      roomId: req.params.roomId,
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;