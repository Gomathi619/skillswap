const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const skillsRoutes = require('./routes/skills');
const matchesRoutes = require('./routes/matches');

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
    // Remove user from online users
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