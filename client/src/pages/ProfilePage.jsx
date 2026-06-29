import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { getProfile, updateProfile } from '../services/profileService';
import Toast from '../components/Toast';

export default function ProfilePage() {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getProfile();
      setSkills(profile.skills || []);
      setProjects(profile.projects || []);
    } catch (err) {
      setToast({ message: 'Failed to load profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      setToast({ message: 'Skill already added.', type: 'error' });
      return;
    }
    setSkills([...skills, trimmed]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddProject = () => {
    setProjects([...projects, { name: '', tech: '', description: '' }]);
  };

  const handleProjectChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const handleRemoveProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanProjects = projects.filter((p) => p.name.trim());
      await updateProfile(skills, cleanProjects);
      setProjects(cleanProjects);
      setToast({ message: 'Profile saved successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to save profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 sm:px-6 py-3 flex justify-between items-center gap-2">
        <h1 className="text-base sm:text-lg font-bold whitespace-nowrap">resume<span className="text-red-600">.</span>ai</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
            ← Builder
          </button>
          <button onClick={handleLogout} className="text-xs sm:text-sm border px-2 sm:px-3 py-1 rounded-md text-gray-600">
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-1">Your Profile</h2>
        <p className="text-gray-500 mb-6">
          Skills and projects you save here are reused every time you tailor a resume — no need to re-enter them.
        </p>

        {/* Skills Section */}
        <div className="bg-white border rounded-lg p-5 mb-6">
          <h3 className="font-semibold mb-3">Skills</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="e.g. React, Python, AWS…"
              className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleAddSkill}
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 && <p className="text-sm text-gray-400">No skills added yet.</p>}
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill}
                <button onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-red-600">
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white border rounded-lg p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Projects</h3>
            <button
              onClick={handleAddProject}
              className="text-sm text-red-600 font-medium hover:underline"
            >
              + Add project
            </button>
          </div>

          {projects.length === 0 && <p className="text-sm text-gray-400">No projects added yet.</p>}

          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="border rounded-md p-3 relative">
                <button
                  onClick={() => handleRemoveProject(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                  placeholder="Project name"
                  className="w-full mb-2 px-3 py-1.5 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="text"
                  value={project.tech}
                  onChange={(e) => handleProjectChange(index, 'tech', e.target.value)}
                  placeholder="Technologies used (comma separated)"
                  className="w-full mb-2 px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <textarea
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  placeholder="Brief description of what you built and your role"
                  rows={2}
                  className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-md hover:bg-red-700 transition disabled:bg-gray-300"
        >
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </main>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}