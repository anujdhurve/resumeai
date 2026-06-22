export default function ClassicTemplate({ data }) {
  if (!data) return null;
  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#111', lineHeight: 1.55, fontSize: 13 }}>
      <div style={{ textAlign: 'center', borderBottom: '2.5px solid #111', paddingBottom: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{data.name || 'Your Name'}</div>
        <div style={{ fontSize: 11, color: '#444', marginTop: 4, fontFamily: 'monospace' }}>{data.contact}</div>
      </div>

      {data.summary && (
        <>
          <SectionTitle label="Professional Summary" />
          <p style={{ fontSize: 12.5, color: '#333', marginBottom: 12 }}>{data.summary}</p>
        </>
      )}

      {data.experience?.length > 0 && (
        <>
          <SectionTitle label="Experience" />
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{e.role}</span>
                <span style={{ fontSize: 11, color: '#555', fontStyle: 'italic' }}>{e.date}</span>
              </div>
              <div style={{ fontSize: 12, color: '#555', fontStyle: 'italic', marginBottom: 4 }}>{e.company}</div>
              <ul style={{ paddingLeft: 18 }}>
                {e.bullets.map((b, j) => <li key={j} style={{ fontSize: 12, marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {data.projects?.length > 0 && (
        <>
          <SectionTitle label="Projects" />
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                <span style={{ fontSize: 11, color: '#555', fontStyle: 'italic' }}>{p.tech}</span>
              </div>
              <ul style={{ paddingLeft: 18 }}>
                {p.bullets.map((b, j) => <li key={j} style={{ fontSize: 12, marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {data.education?.length > 0 && (
        <>
          <SectionTitle label="Education" />
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>{e.degree}</div>
              <div style={{ fontSize: 11.5, color: '#555' }}>{e.institution} {e.year && `· ${e.year}`}</div>
            </div>
          ))}
        </>
      )}

      {data.skills?.length > 0 && (
        <>
          <SectionTitle label="Skills" />
          <p style={{ fontSize: 12 }}>{data.skills.join(' · ')}</p>
        </>
      )}
    </div>
  );
}

function SectionTitle({ label }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
      borderBottom: '1px solid #bbb', paddingBottom: 3, marginBottom: 8, marginTop: 12
    }}>
      {label}
    </div>
  );
}