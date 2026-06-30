import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { getProfile, updateProfile } from '../services/profileService';
import Toast from '../components/Toast';

/* ── Design tokens, loaded once ────────────────────────────────────────── */
const FONT_LINK_ID = 'resumeai-fonts';
function ensureFonts() {
  if (document.getElementById(FONT_LINK_ID)) return;
  const link = document.createElement('link');
  link.id = FONT_LINK_ID;
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(link);
}

export default function ProfilePage() {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [photo, setPhoto] = useState(null); // base64 string or null
  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const photoInputRef = useRef();

  useEffect(() => {
    ensureFonts();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getProfile();
      setSkills(profile.skills || []);
      setProjects(profile.projects || []);
      setPhoto(profile.photo || null);
      setDisplayName(profile.displayName || '');
      setHeadline(profile.headline || '');
    } catch (err) {
      setToast({ message: 'Failed to load profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Please choose an image file.', type: 'error' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: 'Photo must be under 2MB.', type: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) {
      setToast({ message: 'That skill is already on your list.', type: 'error' });
      return;
    }
    setSkills([...skills, trimmed]);
    setSkillInput('');
  };

  const handleRemoveSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleAddProject = () => setProjects([...projects, { name: '', tech: '', description: '' }]);

  const handleProjectChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const handleRemoveProject = (index) => setProjects(projects.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanProjects = projects.filter((p) => p.name.trim());
      await updateProfile(skills, cleanProjects, { photo, displayName, headline });
      setProjects(cleanProjects);
      setToast({ message: 'Profile saved.', type: 'success' });
    } catch (err) {
      setToast({ message: "Couldn't save your profile. Try again.", type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/');
  };

  const initials = (displayName || user?.email || '?')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F0', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .ra-input { font-family: 'Inter', sans-serif; }
        .ra-input::placeholder { color: #A39C8E; }
        .ra-skill-tag { transition: all 0.15s ease; }
        .ra-skill-tag:hover { transform: translateY(-1px); }
        .ra-project-card { transition: border-color 0.15s ease; }
        .ra-project-card:hover { border-color: #A8412B; }
        .ra-photo-ring:hover .ra-photo-overlay { opacity: 1; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header style={{
        background: '#1C1A16', padding: '14px 24px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 19, color: '#FAF7F0', letterSpacing: '-0.01em' }}>
          resume<span style={{ color: '#C4593F' }}>.</span>ai
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: '#B7AE9E', fontSize: 13, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif'"
          }}>← Builder</button>
          <button onClick={() => navigate('/history')} style={{
            background: 'none', border: 'none', color: '#B7AE9E', fontSize: 13, cursor: 'pointer'
          }}>History</button>
          <button onClick={handleLogout} style={{
            background: 'transparent', border: '1px solid #3A362E', color: '#B7AE9E',
            fontSize: 12, padding: '5px 12px', borderRadius: 4, cursor: 'pointer'
          }}>Log out</button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '120px 0', color: '#A39C8E', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
          loading profile…
        </div>
      ) : (
        <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>

          {/* ── Document-style header card ─────────────────────────── */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #E4DDCE', borderRadius: 4,
            padding: '36px 40px', marginBottom: 28, position: 'relative',
            boxShadow: '0 1px 0 #E4DDCE'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 40, right: 40, height: 3,
              background: 'linear-gradient(90deg, #A8412B, #A8412B 24px, transparent 24px, transparent 32px, #A8412B 32px, #A8412B 48px, transparent 48px)'
            }} />

            <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Photo */}
              <div
                className="ra-photo-ring"
                onClick={() => photoInputRef.current.click()}
                style={{
                  width: 88, height: 88, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                  border: '2px solid #E4DDCE', position: 'relative', overflow: 'hidden',
                  background: '#F2EDE1', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                {photo ? (
                  <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 500, color: '#A8412B' }}>
                    {initials || '+'}
                  </span>
                )}
                <div className="ra-photo-overlay" style={{
                  position: 'absolute', inset: 0, background: 'rgba(28,26,22,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.15s ease'
                }}>
                  <span style={{ color: '#FAF7F0', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>edit</span>
                </div>
              </div>

              {/* Name + headline */}
              <div style={{ flex: 1, minWidth: 200, paddingTop: 4 }}>
                <input
                  className="ra-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  style={{
                    fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 26, color: '#1C1A16',
                    border: 'none', outline: 'none', background: 'transparent', width: '100%',
                    padding: '2px 0', marginBottom: 4
                  }}
                />
                <input
                  className="ra-input"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Computer Science student · Full Stack Developer"
                  style={{
                    fontSize: 14, color: '#6B6358', border: 'none', outline: 'none',
                    background: 'transparent', width: '100%', padding: '2px 0'
                  }}
                />
                <p style={{ fontSize: 11, color: '#A39C8E', marginTop: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: '#6B6358', marginBottom: 28, lineHeight: 1.6, maxWidth: 540 }}>
            Skills and projects saved here become the source of truth your tailored resumes draw from — add them once, reuse them on every application.
          </p>

          {/* ── Skills section ───────────────────────────────────────── */}
          <Section title="Skills" eyebrow="01">
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                className="ra-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="React, Python, AWS…"
                style={{
                  flex: 1, padding: '10px 14px', border: '1px solid #E4DDCE', borderRadius: 4,
                  fontSize: 13, outline: 'none', background: '#FFFFFF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#A8412B'}
                onBlur={(e) => e.target.style.borderColor = '#E4DDCE'}
              />
              <button onClick={handleAddSkill} style={{
                background: '#1C1A16', color: '#FAF7F0', border: 'none', borderRadius: 4,
                padding: '0 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer'
              }}>Add</button>
            </div>

            {skills.length === 0 ? (
              <EmptyHint text="No skills yet. Add what you actually know — the AI will only use what's listed here." />
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((skill) => (
                  <span key={skill} className="ra-skill-tag" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: '#F2EDE1', border: '1px solid #E4DDCE', borderRadius: 3,
                    padding: '6px 10px 6px 12px', fontSize: 12.5, color: '#1C1A16'
                  }}>
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: '#A39C8E',
                      fontSize: 13, lineHeight: 1, padding: 0
                    }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </Section>

          {/* ── Projects section ─────────────────────────────────────── */}
          <Section
            title="Projects"
            eyebrow="02"
            action={
              <button onClick={handleAddProject} style={{
                background: 'none', border: 'none', color: '#A8412B', fontSize: 13,
                fontWeight: 500, cursor: 'pointer', padding: 0
              }}>+ Add project</button>
            }
          >
            {projects.length === 0 ? (
              <EmptyHint text="No projects yet. Add the ones worth showing off — these become your resume's primary evidence." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {projects.map((project, index) => (
                  <div key={index} className="ra-project-card" style={{
                    border: '1px solid #E4DDCE', borderRadius: 4, padding: 16,
                    background: '#FFFFFF', position: 'relative'
                  }}>
                    <button onClick={() => handleRemoveProject(index)} style={{
                      position: 'absolute', top: 12, right: 12, background: 'none', border: 'none',
                      color: '#A39C8E', cursor: 'pointer', fontSize: 14
                    }}>×</button>
                    <input
                      className="ra-input"
                      value={project.name}
                      onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                      placeholder="Project name"
                      style={{
                        width: '100%', border: 'none', outline: 'none', fontWeight: 500,
                        fontSize: 14.5, marginBottom: 8, paddingRight: 20
                      }}
                    />
                    <input
                      className="ra-input"
                      value={project.tech}
                      onChange={(e) => handleProjectChange(index, 'tech', e.target.value)}
                      placeholder="Tech used — comma separated"
                      style={{
                        width: '100%', border: 'none', outline: 'none', fontSize: 12.5,
                        color: '#A8412B', fontFamily: "'JetBrains Mono', monospace", marginBottom: 10
                      }}
                    />
                    <textarea
                      className="ra-input"
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                      placeholder="What you built and your role in it"
                      rows={2}
                      style={{
                        width: '100%', border: '1px solid #F0EBDF', borderRadius: 3, outline: 'none',
                        fontSize: 13, padding: '8px 10px', resize: 'vertical', lineHeight: 1.5
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#A8412B'}
                      onBlur={(e) => e.target.style.borderColor = '#F0EBDF'}
                    />
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* ── Save ──────────────────────────────────────────────────── */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', padding: '14px 0', background: saving ? '#D8D2C4' : '#A8412B',
              color: '#FAF7F0', border: 'none', borderRadius: 4, fontSize: 14.5, fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif",
              transition: 'background 0.15s ease', marginTop: 8
            }}
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </main>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

/* ── Local components ─────────────────────────────────────────────────── */
function Section({ title, eyebrow, action, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid #E4DDCE'
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#A8412B',
            letterSpacing: '0.05em'
          }}>{eyebrow}</span>
          <h3 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 18, color: '#1C1A16', margin: 0
          }}>{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyHint({ text }) {
  return (
    <div style={{
      border: '1px dashed #E4DDCE', borderRadius: 4, padding: '18px 16px',
      fontSize: 12.5, color: '#A39C8E', lineHeight: 1.6, textAlign: 'center'
    }}>
      {text}
    </div>
  );
}