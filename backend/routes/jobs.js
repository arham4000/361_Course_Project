const express = require('express');
const { getDb } = require('../db/schema');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { randomUUID } = require('crypto');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole('recruiter'));

router.post('/', (req, res) => {
  const body = req.body || {};
  const id = randomUUID();
  const userId = req.user.id;

  const row = {
    id,
    user_id: userId,
    title: body.title ?? '',
    company: body.company ?? '',
    location: body.location ?? null,
    description: body.description ?? null,
    requirements: body.requirements ?? null,
    experience_level_required: body.experience_level_required ?? null,
    employment_type: body.employment_type ?? null,
    skills_required: body.skills_required ?? null,
    department: body.department ?? null,
  };

  const db = getDb();
  db.prepare(`
    INSERT INTO job_listings (
      id, user_id, title, company, location, description, requirements,
      experience_level_required, employment_type, skills_required, department
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.id, row.user_id, row.title, row.company, row.location, row.description, row.requirements,
    row.experience_level_required, row.employment_type, row.skills_required, row.department
  );

  res.status(201).json({ id: row.id, ...row });
});

router.get('/', (req, res) => {
  const db = getDb();
  const jobs = db.prepare(
    'SELECT * FROM job_listings WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.id);
  res.json(jobs);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const job = db.prepare('SELECT * FROM job_listings WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  res.json(job);
});

module.exports = router;
