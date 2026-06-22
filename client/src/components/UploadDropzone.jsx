import { useState, useRef } from 'react';
import { uploadResume } from '../services/resumeService';

export default function UploadDropzone({ onUploadComplete }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const handleFile = async (file) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB.');
      return;
    }

    setError('');
    setFileName(file.name);
    setUploading(true);

    try {
      const result = await uploadResume(file);
      onUploadComplete(result); // { resumeId, extractedText, fileName }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Try again.');
      setFileName('');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
          ${dragging ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
          ${fileName && !error ? 'border-green-400 bg-green-50' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {uploading ? (
          <div>
            <div className="text-3xl mb-2">⚙️</div>
            <p className="text-red-600 font-medium">Uploading & extracting text…</p>
          </div>
        ) : fileName && !error ? (
          <div>
            <div className="text-3xl mb-2">📄</div>
            <p className="font-semibold text-gray-800">{fileName}</p>
            <p className="text-green-600 text-sm mt-1">✓ Uploaded successfully</p>
          </div>
        ) : (
          <div>
            <div className="text-3xl mb-2">📁</div>
            <p className="font-semibold text-gray-800">Drop your resume here</p>
            <p className="text-gray-400 text-sm mt-1">PDF or DOCX, max 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mt-2">⚠ {error}</p>}
    </div>
  );
}