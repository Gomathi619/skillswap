const mysql = require('mysql2');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    return;
  }
  console.log('MySQL connected successfully! ✅');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully! ✅'))
  .catch((err) => console.error('MongoDB connection failed:', err.message));

module.exports = db;