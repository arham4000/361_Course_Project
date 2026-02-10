import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../api';

const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];

export default function CreateProfile() {
  const [form, setForm] = useState({
    name: '', phone: '', location: '', skills: '', experience_level: '', years_experience: '',
    education: '', preferred_role: '', summary: '',
  });
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
    if (resume) fd.append('resume', resume);
    if (coverLetter) fd.append('cover_letter', coverLetter);
    try {
      await createProfile(fd);
      navigate('/job-seeker/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Create your profile</h2>
      <p>All fields are used for matching. Only essential information is requested.</p>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Full name *</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Phone</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} />
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Portland, OR" />
          <label>Skills (keywords for matching)</label>
          <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. JavaScript React Node.js" />
          <label>Experience level</label>
          <select name="experience_level" value={form.experience_level} onChange={handleChange}>
            <option value="">Select</option>
            {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <label>Years of experience</label>
          <input name="years_experience" type="number" min="0" value={form.years_experience} onChange={handleChange} />
          <label>Education</label>
          <input name="education" value={form.education} onChange={handleChange} />
          <label>Preferred role</label>
          <input name="preferred_role" value={form.preferred_role} onChange={handleChange} placeholder="e.g. Software Engineer" />
          <label>Summary</label>
          <textarea name="summary" value={form.summary} onChange={handleChange} />
          <label>Resume (file)</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files?.[0] || null)} />
          <label>Cover letter (file)</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCoverLetter(e.target.files?.[0] || null)} />
          {error && <p className="error">{error}</p>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
