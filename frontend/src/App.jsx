import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import CreateProfile from './pages/CreateProfile';
import BrowseMatches from './pages/BrowseMatches';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CreateJob from './pages/CreateJob';
import JobCandidateMatches from './pages/JobCandidateMatches';
import HowItWorks from './pages/HowItWorks';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SearchResults from './pages/SearchResults';

function RequireAuth({ children, role }) {
  const { isAuthenticated, role: userRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && userRole !== role) {
    return <Navigate to={userRole === 'job_seeker' ? '/job-seeker/dashboard' : '/recruiter/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="job-seeker/dashboard"
          element={
            <RequireAuth role="job_seeker">
              <JobSeekerDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="job-seeker/profile"
          element={
            <RequireAuth role="job_seeker">
              <CreateProfile />
            </RequireAuth>
          }
        />
        <Route
          path="job-seeker/matches"
          element={
            <RequireAuth role="job_seeker">
              <BrowseMatches />
            </RequireAuth>
          }
        />
        <Route
          path="recruiter/dashboard"
          element={
            <RequireAuth role="recruiter">
              <RecruiterDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="recruiter/jobs/new"
          element={
            <RequireAuth role="recruiter">
              <CreateJob />
            </RequireAuth>
          }
        />
        <Route
          path="recruiter/jobs/:jobId/matches"
          element={
            <RequireAuth role="recruiter">
              <JobCandidateMatches />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
