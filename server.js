// Is route ko server.js mein end mein add kar do
app.post('/admin/update-score', async (req, res) => {
  const { teamName, kills, placement } = req.body;
  // Official System: 1 kill = 1 point + Placement points
  await Team.findOneAndUpdate(
    { teamName: teamName },
    { $inc: { kills: kills, placement: placement } } // $inc use kiya taaki purane points mein add ho
  );
  res.json({ message: 'Scoreboard Updated Successfully!' });
});
