const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat_room_id: {
    type: String,
    required: true
  },
  sender_id: {
    type: Number,
    required: true
  },
  sender_name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);