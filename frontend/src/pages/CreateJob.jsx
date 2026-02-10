import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../api';

const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];
const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export default function CreateJob() {
  const [form, setForm] = useState({
    title: '', company: '', location: '', description: '', requirements: '',
    experience_level_required: '', employment_type: '', skills_required: '', department: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const hasCriteria = form.skills_required?.trim() || form.experience_level_required || form.location?.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!hasCriteria) {
      setError('Please set at least one matching criterion (skills, experience level, or location) before submitting.');
      return;
    }
    try {
      await createJob(form);
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Create job listing</h2>
      <p>Only essential information. Matching criteria (skills, experience level, location) must be set so candidates can be matched transparently.</p>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Job title *</label>
          <input name="title" value={form.title} onChange={handleChange} required />
          <label>Company *</label>
          <input name="company" value={form.company} onChange={handleChange} required />
          <label>Location (matching criterion)</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Portland, OR or Remote" />
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
          <label>Requirements</label>
          <input name="requirements" value={form.requirements} onChange={handleChange} />
          <label>Experience level required (matching criterion)</label>
          <select name="experience_level_required" value={form.experience_level_required} onChange={handleChange}>
            <option value="">Select</option>
            {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <label>Employment type</label>
          <select name="employment_type" value={form.employment_type} onChange={handleChange}>
            <option value="">Select</option>
            {employmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <label>Skills required (matching criterion)</label>
          <input name="skills_required" value={form.skills_required} onChange={handleChange} placeholder="e.g. JavaScript React" />
          <label>Department</label>
          <input name="department" value={form.department} onChange={handleChange} />
          {!hasCriteria && (
            <p className="error">Set at least one of: skills required, experience level, or location so matches can be determined.</p>
          )}
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={!hasCriteria}>Submit</button>
        </form>
      </div>
    </div>
  );
}
