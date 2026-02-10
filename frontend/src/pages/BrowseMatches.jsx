import { useState, useEffect } from 'react';
import { getProfileMe, getProfileMatches } from '../api';

export default function BrowseMatches() {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [hidden, setHidden] = useState(new Set());
  const [applied, setApplied] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfileMe()
      .then((p) => {
        if (!p) {
          setError('Create a profile first to see matches.');
          setLoading(false);
          return;
        }
        setProfile(p);
        return getProfileMatches(p.id);
      })
      .then((data) => {
        if (data?.matches) setMatches(data.matches);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h2>Matched job listings</h2>
      <p>Only listings that match your profile (80% or higher) are shown. Criteria used for each match are displayed.</p>
      {error && <p className="error">{error}</p>}
      {!profile && !error && null}
      {profile && matches.length === 0 && !error && (
        <div className="card">No matches above the 80% threshold right now. Check back later or update your profile.</div>
      )}
      {matches.filter((m) => !hidden.has(m.id)).map((m) => (
        <div key={m.id} className="card">
          <h3>{m.title}</h3>
          <p><strong>Company:</strong> {m.company}</p>
          <p><strong>Location:</strong> {m.location || '—'}</p>
          <p className="match-score">Match score: {m.matchScore ?? '—'}%</p>
          {m.criteria && m.criteria.length > 0 && (
            <p className="criteria">Criteria: {m.criteria.join(', ')}</p>
          )}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {applied.has(m.id) ? (
              <span style={{ color: '#059669', fontWeight: 600 }}>Application Submitted</span>
            ) : (
              <>
                <button type="button" onClick={() => setApplied(prev => new Set(prev).add(m.id))}>Approve</button>
                <button type="button" className="secondary" onClick={() => setHidden(prev => { const s = new Set(prev); s.add(m.id); return s; })}>Ignore</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
