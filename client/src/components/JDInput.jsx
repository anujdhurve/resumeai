export default function JDInput({ jobTitle, setJobTitle, jdText, setJdText }) {
  return (
    <div className="mt-8">
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 mb-2">Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Senior Frontend Engineer"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2">Job Description</label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the full job description here…"
          rows={10}
          className="w-full p-3 border rounded-lg text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <div className="text-right text-xs text-gray-400 mt-1">{jdText.length} chars</div>
      </div>
    </div>
  );
}