import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../api';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="container">
      <h2>Recruiter Dashboard</h2>
      <p><Link to="/recruiter/jobs/new"><button>Create job listing</button></Link></p>
      <h3>Your job listings</h3>
      {jobs.length === 0 ? (
        <div className="card">No job listings yet. Create one to see matched candidates.</div>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="card">
            <h3>{job.title}</h3>
            <p>{job.company} · {job.location || '—'}</p>
            <p><Link to={`/recruiter/jobs/${job.id}/matches`}>View candidate matches</Link></p>
          </div>
        ))
      )}
    </div>
  );
}
