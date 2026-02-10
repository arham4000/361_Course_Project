const path = require('path');
const fs = require('fs');
const config = require('../config');

const dbPath = path.isAbsolute(config.databasePath)
  ? config.databasePath
  : path.join(__dirname, '..', config.databasePath).replace(/\.db$/, '.json');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let data = { users: [], job_seeker_profiles: [], job_listings: [] };

function load() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    data = JSON.parse(raw);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

function save() {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 0), 'utf8');
}

function getDb() {
  load();
  return {
    prepare(sql) {
      const s = sql.replace(/\s+/g, ' ').trim();
      return {
        run(...args) {
          if (s.startsWith('INSERT INTO users (')) {
            data.users.push({
              id: args[0], email: args[1], password_hash: args[2], role: args[3],
              created_at: new Date().toISOString(),
            });
            save();
            return {};
          }
          if (s.startsWith('INSERT OR REPLACE INTO users (')) {
            const i = data.users.findIndex((u) => u.id === args[0]);
            const row = { id: args[0], email: args[1], password_hash: args[2], role: args[3], created_at: new Date().toISOString() };
            if (i >= 0) data.users[i] = row;
            else data.users.push(row);
            save();
            return {};
          }
          if (s.startsWith('INSERT INTO job_seeker_profiles (')) {
            const now = new Date().toISOString();
            data.job_seeker_profiles.push({
              id: args[0], user_id: args[1], name: args[2], phone: args[3], location: args[4], skills: args[5],
              experience_level: args[6], years_experience: args[7], education: args[8], preferred_role: args[9],
              summary: args[10], resume_path: args[11], cover_letter_path: args[12], created_at: now, updated_at: now,
            });
            save();
            return {};
          }
          if (s.startsWith('INSERT OR REPLACE INTO job_seeker_profiles (')) {
            const row = {
              id: args[0], user_id: args[1], name: args[2], phone: args[3], location: args[4], skills: args[5],
              experience_level: args[6], years_experience: args[7], education: args[8], preferred_role: args[9],
              summary: args[10], resume_path: args[11], cover_letter_path: args[12], created_at: args[13], updated_at: args[14],
            };
            const i = data.job_seeker_profiles.findIndex((p) => p.id === args[0]);
            if (i >= 0) data.job_seeker_profiles[i] = row;
            else data.job_seeker_profiles.push(row);
            save();
            return {};
          }
          if (s.startsWith('INSERT INTO job_listings (')) {
            const now = new Date().toISOString();
            data.job_listings.push({
              id: args[0], user_id: args[1], title: args[2], company: args[3], location: args[4], description: args[5],
              requirements: args[6], experience_level_required: args[7], employment_type: args[8],
              skills_required: args[9], department: args[10], created_at: now, updated_at: now,
            });
            save();
            return {};
          }
          if (s.startsWith('INSERT OR REPLACE INTO job_listings (')) {
            const row = {
              id: args[0], user_id: args[1], title: args[2], company: args[3], location: args[4], description: args[5],
              requirements: args[6], experience_level_required: args[7], employment_type: args[8],
              skills_required: args[9], department: args[10], created_at: args[11], updated_at: args[12],
            };
            const i = data.job_listings.findIndex((j) => j.id === args[0]);
            if (i >= 0) data.job_listings[i] = row;
            else data.job_listings.push(row);
            save();
            return {};
          }
          return {};
        },
        get(...args) {
          if (s.includes('FROM users WHERE email')) {
            return data.users.find((u) => u.email === args[0]) || null;
          }
          if (s.includes('FROM job_seeker_profiles WHERE user_id')) {
            const list = data.job_seeker_profiles.filter((p) => p.user_id === args[0])
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            return list[0] || null;
          }
          if (s.includes('FROM job_seeker_profiles WHERE id')) {
            return data.job_seeker_profiles.find((p) => p.id === args[0]) || null;
          }
          if (s.includes('FROM job_listings WHERE id')) {
            return data.job_listings.find((j) => j.id === args[0]) || null;
          }
          return null;
        },
        all(...args) {
          if (s.includes('FROM job_listings') && !s.includes('WHERE id')) {
            if (args.length) {
              return data.job_listings.filter((j) => j.user_id === args[0])
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            return data.job_listings;
          }
          if (s.includes('FROM job_seeker_profiles')) {
            if (args.length) {
              return data.job_seeker_profiles.filter((p) => p.user_id === args[0])
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
            return data.job_seeker_profiles;
          }
          return [];
        },
      };
    },
  };
}

module.exports = { getDb, load, save };
