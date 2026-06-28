import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import { getHistory, deleteHistoryItem } from '../services/resumeService';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tailored resume? This cannot be undone.')) return;
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError('Failed to delete. Try again.');
    }
  };

  const handleOpen = (id) => {
    navigate(`/dashboard?history=${id}`);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/');
  };

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
        <h2 className="text-2xl font-bold mb-1">History</h2>
        <p className="text-gray-500 mb-6">Your past tailored resumes</p>

        {loading && <p className="text-gray-400 text-sm">Loading…</p>}
        {error && <p className="text-red-600 text-sm">⚠ {error}</p>}

        {!loading && history.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-3xl mb-2">📭</div>
            <p>No tailored resumes yet.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 text-sm text-red-600 font-medium hover:underline"
            >
              Tailor your first resume →
            </button>
          </div>
        )}

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg p-4 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{item.jobTitle}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleOpen(item._id)}
                  className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition"
                >
                  Open
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-sm border border-red-200 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}