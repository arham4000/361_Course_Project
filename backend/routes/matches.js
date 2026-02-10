const express = require('express');
const { getDb } = require('../db/schema');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { requestMatch } = require('../services/matchClient');

const router = express.Router();

const MATCH_THRESHOLD = 80;

router.get('/profiles/:id/matches', authMiddleware, requireRole('job_seeker'), async (req, res) => {
  const profileId = req.params.id;
  const db = getDb();
  const profile = db.prepare('SELECT * FROM job_seeker_profiles WHERE id = ?').get(profileId);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  if (profile.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const jobs = db.prepare('SELECT * FROM job_listings').all();
  const payload = {
    type: 'match_profile',
    profile: {
      id: profile.id,
      name: profile.name,
      skills: profile.skills,
      experience_level: profile.experience_level,
      location: profile.location,
      years_experience: profile.years_experience,
    },
    jobs: jobs.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      description: j.description,
      requirements: j.requirements,
      experience_level_required: j.experience_level_required,
      location: j.location,
      skills_required: j.skills_required,
    })),
  };

  try {
    const response = await requestMatch(payload);
    if (response.error) {
      return res.status(502).json({ error: response.error });
    }
    const matches = response.matches || [];
    const aboveThreshold = matches.filter((m) => (m.score || 0) >= MATCH_THRESHOLD);
    const jobIds = aboveThreshold.map((m) => (typeof m === 'object' ? m.id : m));
    const jobMap = Object.fromEntries(jobs.map((j) => [j.id, j]));
    const result = aboveThreshold.map((m) => {
      const id = typeof m === 'object' ? m.id : m;
      const job = jobMap[id];
      return {
        id: job?.id,
        title: job?.title,
        company: job?.company,
        location: job?.location,
        matchScore: typeof m === 'object' ? m.score : null,
        criteria: typeof m === 'object' ? m.criteria : null,
      };
    });
    res.json({ matches: result });
  } catch (err) {
    console.error('Match request failed:', err.message);
    res.status(503).json({ error: 'Matching service unavailable' });
  }
});

router.get('/jobs/:id/matches', authMiddleware, requireRole('recruiter'), async (req, res) => {
  const jobId = req.params.id;
  const db = getDb();
  const job = db.prepare('SELECT * FROM job_listings WHERE id = ?').get(jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  const profiles = db.prepare('SELECT * FROM job_seeker_profiles').all();
  const payload = {
    type: 'match_job',
    job: {
      id: job.id,
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      experience_level_required: job.experience_level_required,
      location: job.location,
      skills_required: job.skills_required,
    },
    profiles: profiles.map((p) => ({
      id: p.id,
      name: p.name,
      skills: p.skills,
      experience_level: p.experience_level,
      location: p.location,
      years_experience: p.years_experience,
    })),
  };

  try {
    const response = await requestMatch(payload);
    if (response.error) {
      return res.status(502).json({ error: response.error });
    }
    const matches = response.matches || [];
    const aboveThreshold = matches.filter((m) => (m.score || 0) >= MATCH_THRESHOLD);
    const profileIds = aboveThreshold.map((m) => (typeof m === 'object' ? m.id : m));
    const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
    const result = aboveThreshold.map((m) => {
      const id = typeof m === 'object' ? m.id : m;
      const profile = profileMap[id];
      return {
        id: profile?.id,
        name: profile?.name,
        skills: profile?.skills,
        experienceLevel: profile?.experience_level,
        location: profile?.location,
        matchScore: typeof m === 'object' ? m.score : null,
        criteria: typeof m === 'object' ? m.criteria : null,
      };
    });
    res.json({ matches: result });
  } catch (err) {
    console.error('Match request failed:', err.message);
    res.status(503).json({ error: 'Matching service unavailable' });
  }
});

module.exports = router;
