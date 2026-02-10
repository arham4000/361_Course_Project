import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('job_seeker');
  const [error, setError] = useState('');
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await register(email, password, role);
      setAuth(data.token, data.role, data.userId);
      if (data.role === 'job_seeker') navigate('/job-seeker/dashboard');
      else navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: '2rem auto' }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label>I am a</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="job_seeker">Job seeker</option>
            <option value="recruiter">Recruiter / Employer</option>
          </select>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button type="submit">Register</button>
        </form>
        <p><Link to="/login">Login instead</Link></p>
      </div>
    </div>
  );
}
