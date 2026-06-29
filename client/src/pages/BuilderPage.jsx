import { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { tailorResume } from '../services/resumeService';
import { exportDocx } from '../services/resumeService';
import UploadDropzone from '../components/UploadDropzone';
import JDInput from '../components/JDInput';
import Toast from '../components/Toast';
import { useSearchParams } from 'react-router-dom';
import { getHistoryItem } from '../services/resumeService';

import { parseResume } from '../utils/parseResume';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import ATSSafeTemplate from '../components/templates/ATSSafeTemplate';
import TemplatePicker from '../components/TemplatePicker';

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jdText, setJdText] = useState('');
  const [tailoredText, setTailoredText] = useState('');
  const [tailoring, setTailoring] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState('classic');
  const [toast, setToast] = useState(null);
  const [searchParams] = useSearchParams();

  const resumeRef = useRef();

  const handlePrint = useReactToPrint({
  contentRef: resumeRef,
  documentTitle: `${jobTitle ? jobTitle.replace(/\s+/g, '-').toLowerCase() : 'tailored'}-resume`,
  });

  useEffect(() => {
  const historyId = searchParams.get('history');
  if (historyId) {
    loadHistoryItem(historyId);
  }
}, [searchParams]);

const loadHistoryItem = async (id) => {
  try {
    const item = await getHistoryItem(id);
    setJobTitle(item.jobTitle);
    setJdText(item.jdText);
    setTailoredText(item.tailoredText);
    setToast({ message: 'Loaded from history', type: 'success' });
  } catch (err) {
    setToast({ message: 'Failed to load this resume from history.', type: 'error' });
  }
};

  const handleDownloadDocx = async () => {
  try {
    const blob = await exportDocx(tailoredText);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jobTitle ? jobTitle.replace(/\s+/g, '-').toLowerCase() : 'tailored'}-resume.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    setToast({ message: 'Failed to export DOCX. Try again.', type: 'error' });
  }
};

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleUploadComplete = (result) => {
    setResumeData(result);
    setResumeText(result.extractedText);
  };

  const renderTemplate = (data) => {
  if (template === 'classic') return <ClassicTemplate data={data} />;
  if (template === 'modern') return <ModernTemplate data={data} />;
  if (template === 'minimal') return <MinimalTemplate data={data} />;
  if (template === 'ats') return <ATSSafeTemplate data={data} />;
};

  const handleTailor = async () => {
    if (!resumeText.trim() || !jdText.trim() || !jobTitle.trim()) {
      setToast({ message: 'Please fill in resume text, job title, and job description.', type: 'error' });
      return;
    }
    setError('');
    setTailoring(true);
    setTailoredText('');

    try {
      const result = await tailorResume(resumeText, jdText, jobTitle, resumeData?.resumeId);
      setTailoredText(result.tailoredText);
      setTailoredText(result.tailoredText);
  setToast({ message: 'Resume tailored successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Tailoring failed. Try again.', type: 'error' });
    } finally {
      setTailoring(false);
    }
  };

  // setTailoredText(result.tailoredText);
  // setToast({ message: 'Resume tailored successfully!', type: 'success' });

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 sm:px-6 py-3 flex justify-between items-center gap-2">
  <h1 className="text-base sm:text-lg font-bold whitespace-nowrap">resume<span className="text-red-600">.</span>ai</h1>
<div className="flex items-center gap-2 sm:gap-4 min-w-0">
  <button onClick={() => navigate('/profile')} className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap">
    Profile
  </button>
  <button onClick={() => navigate('/history')} className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap">
    History
  </button>
  <span className="text-xs sm:text-sm text-gray-500 truncate hidden sm:inline">{user?.email}</span>
  <button onClick={handleLogout} className="text-xs sm:text-sm border px-2 sm:px-3 py-1 rounded-md text-gray-600 whitespace-nowrap">
    Log out
  </button>
</div>
</header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6">
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
  className="mt-4 w-full bg-red-600 text-white font-semibold py-3 rounded-md hover:bg-red-700 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
>
  {tailoring ? (
    <>
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      Tailoring with Gemini…
    </>
  ) : (
    '✦ Tailor Resume'
  )}
</button>
          </>
        )}

        {tailoredText && (
  <div className="mt-8">
    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
  <h3 className="font-bold text-lg">Your tailored resume</h3>
  <div className="flex gap-2">
    <button
      onClick={handlePrint}
      className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-700 transition"
    >
      ⬇ PDF
    </button>
    <button
  onClick={handleDownloadDocx}
  className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition"
  title="DOCX export uses a clean, universal format regardless of selected template"
>
  ⬇ DOCX
</button>
  </div>
</div>
    <TemplatePicker selected={template} onSelect={setTemplate} />
    <p className="text-xs text-gray-400 mb-3">
  Note: DOCX export uses a clean universal format; PDF export matches your selected template above.
</p>
    <div className="overflow-x-auto">
  <div ref={resumeRef} id="resume-print-area" className="bg-white shadow-lg rounded p-6 sm:p-10 max-w-2xl min-w-[340px]">
    {renderTemplate(parseResume(tailoredText))}
  </div>
</div>
  </div>
)}
      </main>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}