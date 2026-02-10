import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="container">
      <h1>Privacy Notice</h1>
      <p>
        This is the privacy notice for Talent Pools. We collect and process data necessary
        to operate the service and match job seekers to job listings. We do not sell user data.
      </p>
      <p>
        For details about what we collect, how we use it, and your rights, contact us or refer
        to the full policy provided here.
      </p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}
