const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Message = require('../models/Message');

// Get chat history between two users
router.get('/history/:match_id', verifyToken, async (req, res) => {
  const chat_room_id = req.params.match_id;

  try {
    const messages = await Message.find({ chat_room_id })
      .sort({ created_at: 1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

module.exports = router;