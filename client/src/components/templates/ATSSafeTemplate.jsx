export default function ATSSafeTemplate({ data }) {
  if (!data) return null;
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#000', fontSize: 12, lineHeight: 1.5 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 'bold' }}>{data.name || 'Your Name'}</div>
        <div style={{ fontSize: 11 }}>{data.contact}</div>
      </div>

      {data.summary && (
        <>
          <Heading text="Summary" />
          <p style={{ fontSize: 11.5 }}>{data.summary}</p>
        </>
      )}

      {data.experience?.length > 0 && (
        <>
          <Heading text="Work Experience" />
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 'bold' }}>{e.role} — {e.company}</div>
              <div style={{ fontSize: 11 }}>{e.date}</div>
              <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                {e.bullets.map((b, j) => <li key={j} style={{ fontSize: 11.5 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {data.projects?.length > 0 && (
        <>
          <Heading text="Projects" />
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 'bold' }}>{p.name} ({p.tech})</div>
              <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                {p.bullets.map((b, j) => <li key={j} style={{ fontSize: 11.5 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {data.education?.length > 0 && (
        <>
          <Heading text="Education" />
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 4, fontSize: 11.5 }}>
              <strong>{e.degree}</strong> — {e.institution} {e.year && `(${e.year})`}
            </div>
          ))}
        </>
      )}

      {data.skills?.length > 0 && (
        <>
          <Heading text="Skills" />
          <p style={{ fontSize: 11.5 }}>{data.skills.join(', ')}</p>
        </>
      )}
    </div>
  );
}

function Heading({ text }) {
  return (
    <div style={{ fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', marginTop: 12, marginBottom: 4, borderBottom: '1px solid #000' }}>
      {text}
    </div>
  );
}