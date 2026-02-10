const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db/schema');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { randomUUID } = require('crypto');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname) || ''}`),
});
const upload = multer({ storage });

router.use(authMiddleware);
router.use(requireRole('job_seeker'));

router.post('/', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'cover_letter', maxCount: 1 }]), (req, res) => {
  const body = req.body || {};
  const resumeFile = req.files?.resume?.[0];
  const coverLetterFile = req.files?.cover_letter?.[0];
  const id = randomUUID();
  const userId = req.user.id;

  const row = {
    id,
    user_id: userId,
    name: body.name ?? '',
    phone: body.phone ?? null,
    location: body.location ?? null,
    skills: body.skills ?? null,
    experience_level: body.experience_level ?? null,
    years_experience: body.years_experience != null ? parseInt(body.years_experience, 10) : null,
    education: body.education ?? null,
    preferred_role: body.preferred_role ?? null,
    summary: body.summary ?? null,
    resume_path: resumeFile ? resumeFile.filename : null,
    cover_letter_path: coverLetterFile ? coverLetterFile.filename : null,
  };

  const db = getDb();
  db.prepare(`
    INSERT INTO job_seeker_profiles (
      id, user_id, name, phone, location, skills, experience_level,
      years_experience, education, preferred_role, summary, resume_path, cover_letter_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.id, row.user_id, row.name, row.phone, row.location, row.skills, row.experience_level,
    row.years_experience, row.education, row.preferred_role, row.summary, row.resume_path, row.cover_letter_path
  );

  res.status(201).json({ id: row.id, ...row });
});

router.get('/me', (req, res) => {
  const db = getDb();
  const profile = db.prepare(
    'SELECT * FROM job_seeker_profiles WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
  ).get(req.user.id);
  if (!profile) return res.status(404).json({ error: 'No profile found' });
  res.json(profile);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const profile = db.prepare('SELECT * FROM job_seeker_profiles WHERE id = ?').get(req.params.id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  if (profile.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(profile);
});

module.exports = router;
