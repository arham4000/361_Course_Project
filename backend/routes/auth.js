const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/schema');
const { authMiddleware } = require('../middleware/auth');
const config = require('../config');
const { randomUUID } = require('crypto');

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }
  if (!['job_seeker', 'recruiter'].includes(role)) {
    return res.status(400).json({ error: 'Role must be job_seeker or recruiter' });
  }
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const id = randomUUID();
  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare(
    'INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(id, email, passwordHash, role);
  const token = jwt.sign(
    { userId: id, role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
  res.status(201).json({ token, role, userId: id });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const db = getDb();
  const user = db.prepare('SELECT id, password_hash, role FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
  res.json({ token, role: user.role, userId: user.id });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ userId: req.user.id, role: req.user.role });
});

module.exports = router;
