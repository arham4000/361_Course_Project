import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 720, margin: '2rem auto' }}>
        <h1>How job matching works</h1>
        <p>
          Talent Pools matches you to jobs (or candidates to jobs) using a few simple, transparent criteria.
          No black box: the same criteria recruiters set on a job are what we use to score fits.
        </p>

        <h2>What we look at</h2>
        <ul>
          <li>
            <strong>Skills</strong> — We compare the skills you list on your profile with the skills the job asks for.
            The more overlap, the higher this part of your score.
          </li>
          <li>
            <strong>Experience level</strong> — Jobs can ask for entry, mid, senior, lead, or executive level.
            We check your stated level and years of experience against what the job requires.
          </li>
          <li>
            <strong>Location</strong> — If the job has a location, we see how well it matches your preferred location
            (e.g. same city or “Remote”).
          </li>
        </ul>

        <h2>How your score is calculated</h2>
        <p>
          Each of the three areas above gets a score from 0 to 100. We combine them with fixed weights:
          skills count the most (50%), then experience level (30%), then location (20%).
          The result is a single match score from 0 to 100%.
        </p>

        <h2>What you see</h2>
        <p>
          Only matches at <strong>80% or higher</strong> are shown. For each match we display the score and
          which criteria were used (e.g. “skills, experience level, location”) so you can see why a job
          or candidate was recommended.
        </p>

        <p>
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
