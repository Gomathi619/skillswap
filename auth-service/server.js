const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const skillsRoutes = require('./routes/skills');
const matchesRoutes = require('./routes/matches');
const chatRoutes = require('./routes/chat');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/chat', chatRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'SkillSwap Auth Service is running! 🚀' });
});

// Store online users
const onlineUsers = {};

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // User joins with their user id
  socket.on('join', (user_id) => {
    onlineUsers[user_id] = socket.id;
    console.log(`User ${user_id} is online`);
  });

  // Join a chat room
  socket.on('join_room', (match_id) => {
    socket.join(match_id);
    console.log(`User joined chat room: ${match_id}`);
  });

  // Send message
  socket.on('send_message', async ({ match_id, sender_id, sender_name, message }) => {
    try {
      // Save message to MongoDB
      const newMessage = new Message({
        chat_room_id: match_id,
        sender_id,
        sender_name,
        message
      });
      await newMessage.save();

      // Send message to everyone in the room
      io.to(match_id).emit('receive_message', {
        sender_id,
        sender_name,
        message,
        created_at: new Date()
      });

      console.log(`Message from ${sender_name}: ${message}`);
    } catch (err) {
      console.error('Message save failed:', err.message);
    }
  });

  // Send swap request notification
  socket.on('send_request', ({ to_user_id, from_user_name }) => {
    const receiverSocket = onlineUsers[to_user_id];
    if (receiverSocket) {
      io.to(receiverSocket).emit('new_request', {
        message: `${from_user_name} wants to swap skills with you! 🎉`
      });
    }
  });

  socket.on('disconnect', () => {
    Object.keys(onlineUsers).forEach(key => {
      if (onlineUsers[key] === socket.id) {
        delete onlineUsers[key];
      }
    });
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});