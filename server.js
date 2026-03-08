const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://tinyji6887_db_user:85158@cluster0.zu7kwc5.mongodb.net/magesports?appName=Cluster0')
.then(() => console.log('Database Connected!'));

// Schemas
const TeamSchema = new mongoose.Schema({
  teamName: String, secretToken: String, utrNumber: String,
  isVerified: { type: Boolean, default: false },
  kills: { type: Number, default: 0 }, placement: { type: Number, default: 0 }
});
const LobbySchema = new mongoose.Schema({
  name: String, mode: String, time: String, map: String, fee: String,
  roomId: { type: String, default: "TBA" }, roomPass: { type: String, default: "TBA" },
  status: { type: String, default: "Open" } // Open, Live, Closed
});

const Team = mongoose.model('Team', TeamSchema);
const Lobby = mongoose.model('Lobby', LobbySchema);

// API Routes
app.post('/register', async (req, res) => {
  const team = new Team(req.body);
  await team.save();
  res.json({ message: 'Registration Done! Wait for approval.' });
});

app.get('/lobbies', async (req, res) => {
  const data = await Lobby.find();
  res.json(data);
});

app.get('/points', async (req, res) => {
  const teams = await Team.find({ isVerified: true }).sort({ placement: 1 });
  res.json(teams);
});

// Admin Only Routes
app.post('/admin/lobby', async (req, res) => {
  await new Lobby(req.body).save();
  res.json({ message: 'Lobby Created' });
});

app.post('/admin/verify', async (req, res) => {
  await Team.findOneAndUpdate({ utrNumber: req.body.utr }, { isVerified: true });
  res.json({ message: 'Team Verified' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Live on ${PORT}`));
