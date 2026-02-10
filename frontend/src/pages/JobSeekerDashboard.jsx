import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfileMe } from '../api';

export default function JobSeekerDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getProfileMe()
      .then((p) => setProfile(p))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <h2>Job Seeker Dashboard</h2>
      {profile ? (
        <div className="card">
          <form className="home-search-form" onSubmit={(e) => {
            e.preventDefault();
            const trimmed = search.trim();
            if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
            else navigate('/search');
          }}>
            <input
              type="search"
              className="home-search-input"
              placeholder="find your next match"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            <button type="submit">Search</button>
          </form>
          <h3>Your profile</h3>
          <p><strong>{profile.name}</strong></p>
          <p>{profile.summary}</p>
          <p>Skills: {profile.skills}</p>
          <p>Location: {profile.location}</p>
          <p>
            <Link to="/job-seeker/matches">View my job matches</Link>
          </p>
        </div>
      ) : (
        <div className="card">
          <p>You don&apos;t have a profile yet. Create one to see matched jobs.</p>
          <Link to="/job-seeker/profile"><button>Create profile</button></Link>
        </div>
      )}
    </div>
  );
}
