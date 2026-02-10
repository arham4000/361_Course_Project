import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPublicJobs } from '../api';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(q);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSearchInput(q);
    setLoading(true);
    setError(null);
    getPublicJobs(q)
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => {
        setJobs([]);
        setError(err.message || 'Unable to load jobs. Make sure the backend is running.');
      })
      .finally(() => setLoading(false));
  }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  };

  return (
    <div className="container">
      <p><Link to="/">← Back to home</Link></p>
      <h1>Job search</h1>
      <h3>*Log in to begin matching with jobs!</h3>

      <form className="home-search-form" onSubmit={handleSubmit}>
        <label htmlFor="search-results-input" className="sr-only">Search job listings</label>
        <input
          id="search-results-input"
          type="search"
          className="home-search-input"
          placeholder="Search by title, company, location, or skills…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {q && (
        <p className="search-results-query">
          Results for &ldquo;{q}&rdquo;
        </p>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="home-no-results">No job listings found. Try a different search, or run <code>npm run seed</code> in the backend folder to load sample listings.</p>
      ) : (
        <ul className="home-job-list">
          {jobs.map((job) => (
            <li key={job.id} className="card home-job-card">
              <h3>{job.title}</h3>
              <p><strong>{job.company}</strong>{job.location ? ` · ${job.location}` : ''}</p>
              {job.skills_required && <p className="home-job-skills">Skills: {job.skills_required}</p>}
              {job.description && <p className="home-job-desc">{job.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
