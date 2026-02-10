import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/search');
    }
  };

  if (isAuthenticated && role === 'job_seeker') {
    return <Navigate to="/job-seeker/dashboard" replace />;
  }
  if (isAuthenticated && role === 'recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  return (
    <div className="container">
      <div className="home-hero">
        <div className="home-logo" aria-hidden="true">
          <span className="home-logo-icon">TP</span>
          <span className="home-logo-text">Talent Pools</span>
        </div>
        <form className="home-search-form" onSubmit={handleSearchSubmit}>
          <label htmlFor="home-job-search" className="sr-only">Search job listings</label>
          <input
            id="home-job-search"
            type="search"
            className="home-search-input"
            placeholder="Search job listings by title, company, location, or skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </form>
        <p className="home-links">
          <Link to="/login" className="home-link-btn" aria-label="Login">Login</Link>
          <Link to="/register" className="home-link-btn secondary" aria-label="Register">Register</Link>
        </p>
        <p className="home-tagline">No feeds. No noise. Just relevant jobs matched to your skills.
          <Link to="/how-it-works"> Learn more about how our algorithm works.</Link>
        </p>

        

      </div>
    </div>
  );
}
