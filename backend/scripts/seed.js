const path = require('path');
const bcrypt = require('bcryptjs');

process.env.DATABASE_PATH = path.join(__dirname, '..', 'data', 'app.json');
const { getDb } = require('../db/schema');

const passwordHash = bcrypt.hashSync('password', 10);

const jobSeekerUserIds = [
  '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111102',
  '11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111104',
  '11111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111106',
  '11111111-1111-1111-1111-111111111107', '11111111-1111-1111-1111-111111111108',
  '11111111-1111-1111-1111-111111111109', '11111111-1111-1111-1111-11111111110a',
];
const profileIds = [
  '22222222-2222-2222-2222-222222222201', '22222222-2222-2222-2222-222222222202',
  '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222204',
  '22222222-2222-2222-2222-222222222205', '22222222-2222-2222-2222-222222222206',
  '22222222-2222-2222-2222-222222222207', '22222222-2222-2222-2222-222222222208',
  '22222222-2222-2222-2222-222222222209', '22222222-2222-2222-2222-22222222220a',
];
const recruiterUserId = '33333333-3333-3333-3333-333333333301';
const jobIds = [
  '44444444-4444-4444-4444-444444444401', '44444444-4444-4444-4444-444444444402',
  '44444444-4444-4444-4444-444444444403', '44444444-4444-4444-4444-444444444404',
  '44444444-4444-4444-4444-444444444405', '44444444-4444-4444-4444-444444444406',
  '44444444-4444-4444-4444-444444444407', '44444444-4444-4444-4444-444444444408',
  '44444444-4444-4444-4444-444444444409', '44444444-4444-4444-4444-44444444440a',
];

const jobSeekers = [
  { email: 'jobseeker1@example.com', name: 'Alex Chen', phone: '555-0101', location: 'Portland, OR', skills: 'JavaScript React Node.js TypeScript', experience_level: 'mid', years_experience: 3, education: 'BS Computer Science', preferred_role: 'Software Engineer', summary: 'Full-stack developer with React and Node experience.' },
  { email: 'jobseeker2@example.com', name: 'Jordan Smith', phone: '555-0102', location: 'Seattle, WA', skills: 'Python Django SQL AWS', experience_level: 'senior', years_experience: 6, education: 'MS Software Engineering', preferred_role: 'Backend Engineer', summary: 'Backend and cloud-focused engineer.' },
  { email: 'jobseeker3@example.com', name: 'Sam Rivera', phone: '555-0103', location: 'Portland, OR', skills: 'Java Spring REST API', experience_level: 'mid', years_experience: 4, education: 'BS CS', preferred_role: 'Software Developer', summary: 'Java backend developer.' },
  { email: 'jobseeker4@example.com', name: 'Casey Lee', phone: '555-0104', location: 'Remote', skills: 'React Vue JavaScript CSS', experience_level: 'mid', years_experience: 2, education: 'Bootcamp', preferred_role: 'Frontend Developer', summary: 'Frontend specialist.' },
  { email: 'jobseeker5@example.com', name: 'Morgan Taylor', phone: '555-0105', location: 'Seattle, WA', skills: 'Python data analysis SQL', experience_level: 'entry', years_experience: 1, education: 'BS Statistics', preferred_role: 'Data Analyst', summary: 'Entry-level data analyst.' },
  { email: 'jobseeker6@example.com', name: 'Riley Brown', phone: '555-0106', location: 'Portland, OR', skills: 'JavaScript Node.js React MongoDB', experience_level: 'senior', years_experience: 7, education: 'BS CS', preferred_role: 'Full Stack Engineer', summary: 'Senior full-stack developer.' },
  { email: 'jobseeker7@example.com', name: 'Quinn Davis', phone: '555-0107', location: 'Eugene, OR', skills: 'C# .NET SQL Server', experience_level: 'mid', years_experience: 5, education: 'BS CS', preferred_role: 'Software Engineer', summary: '.NET developer.' },
  { email: 'jobseeker8@example.com', name: 'Avery Wilson', phone: '555-0108', location: 'Seattle, WA', skills: 'React TypeScript Node.js AWS', experience_level: 'mid', years_experience: 4, education: 'BS CS', preferred_role: 'Software Engineer', summary: 'Full-stack with cloud experience.' },
  { email: 'jobseeker9@example.com', name: 'Jordan Kim', phone: '555-0109', location: 'Portland, OR', skills: 'Python JavaScript SQL', experience_level: 'entry', years_experience: 0, education: 'BS CS', preferred_role: 'Junior Developer', summary: 'Recent graduate seeking first role.' },
  { email: 'jobseeker10@example.com', name: 'Skyler Martinez', phone: '555-0110', location: 'Remote', skills: 'React Node.js Docker Kubernetes', experience_level: 'senior', years_experience: 8, education: 'MS CS', preferred_role: 'DevOps Engineer', summary: 'Senior engineer with DevOps focus.' },
];

const jobListings = [
  { title: 'Software Engineer - Full Stack', company: 'TechCorp', location: 'Portland, OR', description: 'Build web applications.', requirements: 'React, Node.js, 3+ years', experience_level_required: 'mid', employment_type: 'Full-time', skills_required: 'JavaScript React Node.js', department: 'Engineering' },
  { title: 'Backend Developer', company: 'DataFlow Inc', location: 'Seattle, WA', description: 'APIs and services.', requirements: 'Python or Java, 4+ years', experience_level_required: 'mid', employment_type: 'Full-time', skills_required: 'Python SQL API', department: 'Engineering' },
  { title: 'Frontend Developer', company: 'WebStart', location: 'Remote', description: 'User interfaces.', requirements: 'React or Vue, 2+ years', experience_level_required: 'mid', employment_type: 'Full-time', skills_required: 'React Vue JavaScript CSS', department: 'Engineering' },
  { title: 'Senior Software Engineer', company: 'ScaleUp', location: 'Seattle, WA', description: 'Lead features and systems.', requirements: '5+ years, distributed systems', experience_level_required: 'senior', employment_type: 'Full-time', skills_required: 'JavaScript Node.js React', department: 'Engineering' },
  { title: 'Data Analyst', company: 'Analytics Co', location: 'Portland, OR', description: 'Reports and insights.', requirements: 'SQL, Python, 1+ years', experience_level_required: 'entry', employment_type: 'Full-time', skills_required: 'Python SQL data analysis', department: 'Data' },
  { title: 'Java Developer', company: 'Enterprise Solutions', location: 'Portland, OR', description: 'Enterprise backend services.', requirements: 'Java, Spring, 3+ years', experience_level_required: 'mid', employment_type: 'Full-time', skills_required: 'Java Spring REST', department: 'Engineering' },
  { title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'Remote', description: 'End-to-end product development.', requirements: 'React, Node, 4+ years', experience_level_required: 'mid', employment_type: 'Full-time', skills_required: 'React Node.js JavaScript', department: 'Engineering' },
  { title: 'Junior Developer', company: 'Growth Labs', location: 'Eugene, OR', description: 'Learn and contribute to the codebase.', requirements: 'CS degree or bootcamp', experience_level_required: 'entry', employment_type: 'Full-time', skills_required: 'Python JavaScript', department: 'Engineering' },
  { title: 'DevOps Engineer', company: 'CloudFirst', location: 'Seattle, WA', description: 'CI/CD and infrastructure.', requirements: 'Docker, K8s, 5+ years', experience_level_required: 'senior', employment_type: 'Full-time', skills_required: 'Docker Kubernetes AWS', department: 'Platform' },
  { title: '.NET Developer', company: 'Legacy Systems Co', location: 'Portland, OR', description: 'Maintain and extend .NET applications.', requirements: 'C#, .NET, 3+ years', experience_level_required: 'mid', employment_type: 'Full-time', skills_required: 'C# .NET SQL', department: 'Engineering' },
];

function run() {
  const db = getDb();
  const now = new Date().toISOString();

  jobSeekers.forEach((js, i) => {
    const userId = jobSeekerUserIds[i];
    const profileId = profileIds[i];
    db.prepare(
      'INSERT OR REPLACE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)'
    ).run(userId, js.email, passwordHash, 'job_seeker');
    db.prepare(`
      INSERT OR REPLACE INTO job_seeker_profiles (
        id, user_id, name, phone, location, skills, experience_level, years_experience,
        education, preferred_role, summary, resume_path, cover_letter_path, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      profileId, userId, js.name, js.phone, js.location, js.skills, js.experience_level,
      js.years_experience, js.education, js.preferred_role, js.summary, null, null, now, now
    );
  });

  db.prepare(
    'INSERT OR REPLACE INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(recruiterUserId, 'recruiter@example.com', passwordHash, 'recruiter');

  jobListings.forEach((j, i) => {
    const jobId = jobIds[i];
    db.prepare(`
      INSERT OR REPLACE INTO job_listings (
        id, user_id, title, company, location, description, requirements,
        experience_level_required, employment_type, skills_required, department, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      jobId, recruiterUserId, j.title, j.company, j.location, j.description, j.requirements,
      j.experience_level_required, j.employment_type, j.skills_required, j.department, now, now
    );
  });

  console.log('Seeded 10 job seeker profiles and 10 job listings.');
  console.log('Job seeker logins: jobseeker1@example.com ... jobseeker10@example.com (password: password)');
  console.log('Recruiter login: recruiter@example.com (password: password)');
}

run();
