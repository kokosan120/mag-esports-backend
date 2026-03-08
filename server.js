const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://tinyji6887_db_user:85158@cluster0.zu7kwc5.mongodb.net/magesports?appName=Cluster0')
.then(() => console.log('Database Connected!'))
.catch((err) => console.log('DB Connection Error:', err));

// Database Schema
const Team = mongoose.model('Team', new mongoose.Schema({
  teamName: String,
  secretToken: String,
  utrNumber: String,
  isVerified: { type: Boolean, default: false }
}));

// Registration API
app.post('/register', async (req, res) => {
  try {
    const { teamName, secretToken, utrNumber } = req.body;
    await new Team({ teamName, secretToken, utrNumber }).save();
    res.json({ message: 'Registration successful! Wait for Admin Verification.' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
