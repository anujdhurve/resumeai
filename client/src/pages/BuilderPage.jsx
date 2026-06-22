import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { tailorResume } from '../services/resumeService';
import { parseResume } from '../utils/parseResume';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import ATSSafeTemplate from '../components/templates/ATSSafeTemplate';
import TemplatePicker from '../components/TemplatePicker';
import UploadDropzone from '../components/UploadDropzone';
import JDInput from '../components/JDInput';

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jdText, setJdText] = useState('');
  const [tailoredText, setTailoredText] = useState('');
  const [tailoring, setTailoring] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState('classic');

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleUploadComplete = (result) => {
    setResumeData(result);
    setResumeText(result.extractedText);
  };

  const handleTailor = async () => {
    if (!resumeText.trim() || !jdText.trim() || !jobTitle.trim()) {
      setError('Please fill in resume text, job title, and job description.');
      return;
    }
    setError('');
    setTailoring(true);
    setTailoredText('');

    try {
      const result = await tailorResume(resumeText, jdText, jobTitle, resumeData?.resumeId);
      setTailoredText(result.tailoredText);
    } catch (err) {
      setError(err.response?.data?.message || 'Tailoring failed. Try again.');
    } finally {
      setTailoring(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/');
  };

  const renderTemplate = (data) => {
  if (template === 'classic') return <ClassicTemplate data={data} />;
  if (template === 'modern') return <ModernTemplate data={data} />;
  if (template === 'minimal') return <MinimalTemplate data={data} />;
  if (template === 'ats') return <ATSSafeTemplate data={data} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">resume<span className="text-red-600">.</span>ai</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button onClick={handleLogout} className="text-sm border px-3 py-1 rounded-md text-gray-600">
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-1">Build your resume</h2>
        <p className="text-gray-500 mb-6">Upload your resume to get started</p>

        <UploadDropzone onUploadComplete={handleUploadComplete} />

        {resumeData && (
          <div className="mt-6">
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Extracted text (editable)
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={10}
              className="w-full p-4 border rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}

        {resumeText && (
          <>
            <JDInput jobTitle={jobTitle} setJobTitle={setJobTitle} jdText={jdText} setJdText={setJdText} />

            {error && <p className="text-red-600 text-sm mt-3">⚠ {error}</p>}

            <button
              onClick={handleTailor}
              disabled={tailoring}
              className="mt-4 w-full bg-red-600 text-white font-semibold py-3 rounded-md hover:bg-red-700 transition disabled:bg-gray-300"
            >
              {tailoring ? 'Tailoring with Gemini…' : '✦ Tailor Resume'}
            </button>
          </>
        )}

        {tailoredText && (
  <div className="mt-8">
    <h3 className="font-bold text-lg mb-3">Your tailored resume</h3>
    <TemplatePicker selected={template} onSelect={setTemplate} />
    <div className="bg-white shadow-lg rounded p-10 max-w-2xl">
      {renderTemplate(parseResume(tailoredText))}
    </div>
  </div>
)}
      </main>
    </div>
  );
}






////////////////replace this if needed

// {tailoredText && (
//   <details className="mt-4 text-xs text-gray-400">
//     <summary className="cursor-pointer">Debug: raw AI output</summary>
//     <pre className="whitespace-pre-wrap mt-2 p-3 bg-gray-100 rounded">{tailoredText}</pre>
//   </details>
// )}