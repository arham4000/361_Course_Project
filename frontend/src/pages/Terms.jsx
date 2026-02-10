import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="container">
      <h1>Terms of Service</h1>
      <p>
        These Terms of Service govern your use of Talent Pools. By using the service, you
        agree to comply with these terms. Use of the site is subject to applicable laws.
      </p>
      <p>
        This page provides a short summary; the full legal terms and disclaimers are outlined here.
      </p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}
