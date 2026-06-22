const TEMPLATES = [
  { id: 'classic', label: 'Classic', icon: '📜' },
  { id: 'modern', label: 'Modern', icon: '⬛' },
  { id: 'minimal', label: 'Minimal', icon: '◻️' },
  { id: 'ats', label: 'ATS-Safe', icon: '🤖' },
];

export default function TemplatePicker({ selected, onSelect }) {
  return (
    <div className="flex gap-2 mb-4 border-b">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            selected === t.id
              ? 'border-red-600 text-gray-900'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}