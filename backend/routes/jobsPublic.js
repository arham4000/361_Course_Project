const express = require('express');
const { getDb } = require('../db/schema');

const router = express.Router();

router.get('/public/jobs', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  const db = getDb();
  let jobs = db.prepare('SELECT * FROM job_listings').all();
  if (q) {
    jobs = jobs.filter(
      (j) =>
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.company && j.company.toLowerCase().includes(q)) ||
        (j.location && j.location.toLowerCase().includes(q)) ||
        (j.description && j.description.toLowerCase().includes(q)) ||
        (j.requirements && j.requirements.toLowerCase().includes(q)) ||
        (j.skills_required && j.skills_required.toLowerCase().includes(q)) ||
        (j.department && j.department.toLowerCase().includes(q))
    );
  }
  const publicJobs = jobs.map(({ user_id, ...rest }) => rest);
  res.json({ jobs: publicJobs });
});

module.exports = router;
