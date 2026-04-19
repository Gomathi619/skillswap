const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// Find matching users
router.get('/find', verifyToken, (req, res) => {
  const user_id = req.user.id;

  // Get current user's skills
  db.query(
    'SELECT * FROM skills WHERE user_id = ?',
    [user_id],
    (err, mySkills) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (mySkills.length === 0) {
        return res.status(400).json({ message: 'Please add your skills first!' });
      }

      // Get what I want to learn
      const learnSkills = mySkills
        .filter(s => s.type === 'learn')
        .map(s => s.skill_name);

      // Get what I can teach
      const teachSkills = mySkills
        .filter(s => s.type === 'teach')
        .map(s => s.skill_name);

      if (learnSkills.length === 0 || teachSkills.length === 0) {
        return res.status(400).json({ 
          message: 'Please add both teach and learn skills!' 
        });
      }

      // Find users who can teach what I want to learn
      // AND want to learn what I can teach
      db.query(
        `SELECT DISTINCT u.id, u.name, u.email,
         s1.skill_name as they_teach,
         s2.skill_name as they_learn
         FROM users u
         JOIN skills s1 ON u.id = s1.user_id AND s1.type = 'teach'
         JOIN skills s2 ON u.id = s2.user_id AND s2.type = 'learn'
         WHERE u.id != ?
         AND s1.skill_name IN (?)
         AND s2.skill_name IN (?)`,
        [user_id, learnSkills, teachSkills],
        (err, matches) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.json({ matches });
        }
      );
    }
  );
});

// Send swap request
router.post('/request', verifyToken, (req, res) => {
  const user1_id = req.user.id;
  const { user2_id } = req.body;

  // Check if request already exists
  db.query(
    'SELECT * FROM matches WHERE user1_id = ? AND user2_id = ?',
    [user1_id, user2_id],
    (err, existing) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (existing.length > 0) {
        return res.status(400).json({ message: 'Request already sent!' });
      }

      // Create match request
      db.query(
        'INSERT INTO matches (user1_id, user2_id) VALUES (?, ?)',
        [user1_id, user2_id],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'Failed to send request' });
          res.status(201).json({ 
            message: 'Swap request sent successfully! 🎉',
            match_id: result.insertId
          });
        }
      );
    }
  );
});

// Accept or reject swap request
router.put('/respond/:id', verifyToken, (req, res) => {
  const match_id = req.params.id;
  const { status } = req.body; // 'accepted' or 'rejected'

  db.query(
    'UPDATE matches SET status = ? WHERE id = ?',
    [status, match_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: `Request ${status} successfully! 🎉` });
    }
  );
});

// Get all my swap requests
router.get('/my-requests', verifyToken, (req, res) => {
  const user_id = req.user.id;

  db.query(
    `SELECT m.id, m.status, m.created_at,
     u.name as requested_by, u.email as requested_by_email
     FROM matches m
     JOIN users u ON m.user1_id = u.id
     WHERE m.user2_id = ? OR m.user1_id = ?`,
    [user_id, user_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ requests: results });
    }
  );
});

module.exports = router;