import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJob, getJobMatches } from '../api';

export default function JobCandidateMatches() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hidden, setHidden] = useState(new Set());
  const [applied, setApplied] = useState(new Set());

  useEffect(() => {
    Promise.all([getJob(jobId), getJobMatches(jobId)])
      .then(([j, data]) => {
        setJob(j);
        setMatches(data.matches || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!job) return <div className="container"><p>Job not found.</p></div>;

  return (
    <div className="container">
      <p><Link to="/recruiter/dashboard">← Back to dashboard</Link></p>
      <h2>Candidate matches: {job.title}</h2>
      <p>Only candidates that match at 80% or higher are shown. Criteria used for each match are displayed.</p>
      {matches.length === 0 ? (
        <div className="card">No candidate matches above the 80% threshold for this job.</div>
      ) : (
        matches.map((m) => (
          <div key={m.id} className="card">
            <h3>{m.name}</h3>
            <p>Skills: {m.skills || '—'}</p>
            <p>Experience: {m.experienceLevel || '—'}</p>
            <p>Location: {m.location || '—'}</p>
            <p className="match-score">Match score: {m.matchScore ?? '—'}%</p>
            {m.criteria && m.criteria.length > 0 && (
              <p className="criteria">Criteria: {m.criteria.join(', ')}</p>
            )}
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {applied.has(m.id) ? (
              <span style={{ color: '#059669', fontWeight: 600 }}>Candidate Invited</span>
            ) : (
              <>
                <button type="button" onClick={() => setApplied(prev => new Set(prev).add(m.id))}>Invite</button>
                <button type="button" className="secondary" onClick={() => setHidden(prev => { const s = new Set(prev); s.add(m.id); return s; })}>Ignore</button>
              </>
            )}
          </div>
          </div>
          
        ))
      )}
    </div>
  );
}
