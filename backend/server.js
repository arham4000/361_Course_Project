const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const jobRoutes = require('./routes/jobs');
const jobsPublicRoutes = require('./routes/jobsPublic');
const matchRoutes = require('./routes/matches');
const { getDb } = require('./db/schema');

const app = express();

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api', jobsPublicRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api', matchRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

getDb();
app.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
});
