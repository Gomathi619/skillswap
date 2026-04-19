const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Add a skill
router.post('/add', verifyToken, (req, res) => {
  const { skill_name, type } = req.body;
  const user_id = req.user.id;

  db.query(
    'INSERT INTO skills (user_id, skill_name, type) VALUES (?, ?, ?)',
    [user_id, skill_name, type],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to add skill' });
      res.status(201).json({ message: 'Skill added successfully! 🎉' });
    }
  );
});

// Get all skills of logged in user
router.get('/my-skills', verifyToken, (req, res) => {
  const user_id = req.user.id;

  db.query(
    'SELECT * FROM skills WHERE user_id = ?',
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch skills' });
      res.json({ skills: results });
    }
  );
});

// Get all users with their skills
router.get('/all', verifyToken, (req, res) => {
  db.query(
    `SELECT users.id, users.name, users.email, 
     skills.skill_name, skills.type 
     FROM users 
     JOIN skills ON users.id = skills.user_id`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch skills' });
      res.json({ users: results });
    }
  );
});

module.exports = router;