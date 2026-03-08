const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://tinyji6887_db_user:85158@cluster0.zu7kwc5.mongodb.net/magesports?appName=Cluster0')
.then(() => console.log('Database Connected!'))
.catch(err => console.log(err));

// Schemas
const Team = mongoose.model('Team', new mongoose.Schema({
  teamName: String, secretToken: String, utrNumber: String,
  isVerified: { type: Boolean, default: false },
  kills: { type: Number, default: 0 }, placement: { type: Number, default: 0 }
}));

const Lobby = mongoose.model('Lobby', new mongoose.Schema({
  name: String, mode: String, time: String, map: String, fee: String,
  status: { type: String, default: "Open" }
}));

// API Routes
app.get('/lobbies', async (req, res) => { res.json(await Lobby.find()); });

app.get('/points', async (req, res) => { res.json(await Team.find({ isVerified: true })); });

app.post('/register', async (req, res) => {
  await new Team(req.body).save();
  res.json({ message: 'Registration Done!' });
});

// Admin Routes
app.post('/admin/lobby', async (req, res) => {
  await new Lobby(req.body).save();
  res.json({ message: 'Lobby Created' });
});

app.post('/admin/verify', async (req, res) => {
  await Team.findOneAndUpdate({ utrNumber: req.body.utr }, { isVerified: true });
  res.json({ message: 'Team Verified' });
});

app.post('/admin/update-score', async (req, res) => {
  const { teamName, kills, placement } = req.body;
  await Team.findOneAndUpdate({ teamName }, { $inc: { kills, placement } });
  res.json({ message: 'Scoreboard Updated!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
