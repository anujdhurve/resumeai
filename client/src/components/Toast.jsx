import { useEffect } from 'react';

export default function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm border rounded-lg px-4 py-3 shadow-lg flex items-start gap-3 ${styles[type]}`}>
      <span>{type === 'error' ? '⚠' : '✓'}</span>
      <p className="text-sm flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-50 hover:opacity-100">✕</button>
    </div>
  );
}