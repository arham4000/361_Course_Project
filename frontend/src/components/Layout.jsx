import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Layout() {
  const { isAuthenticated, role, logout } = useAuth();

  return (
    <>
      <nav>
        <Link to="/">Talent Pools</Link>
        <Link to="/how-it-works">How it works</Link>
        {isAuthenticated ? (
          <>
            {role === 'job_seeker' && (
              <>
                <Link to="/job-seeker/dashboard">Dashboard</Link>
                <Link to="/job-seeker/profile">My Profile</Link>
                <Link to="/job-seeker/matches">My Matches</Link>
              </>
            )}
            {role === 'recruiter' && (
              <>
                <Link to="/recruiter/dashboard">Dashboard</Link>
                <Link to="/recruiter/jobs/new">Create Job</Link>
              </>
            )}
            <button type="button" className="secondary" onClick={logout} style={{ marginLeft: 'auto' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
      <div>
        <p className="home-consent">
          By using this site, you agree to our{' '}
          <Link to="/privacy">privacy notice</Link>{' '}
          and{' '}
          <Link to="/terms">terms of service</Link>.
        </p>
      
      <div className='copyrightcontainer'>
        
        <p>© {new Date().getFullYear()} Talent Pools</p>
      </div>
      </div>
    </>
  );
}
