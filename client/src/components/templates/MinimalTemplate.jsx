export default function MinimalTemplate({ data }) {
  if (!data) return null;
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1814', fontSize: 12.5 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 300, marginBottom: 4 }}>{data.name || 'Your Name'}</div>
        <div style={{ fontSize: 11, color: '#8a8070', fontFamily: 'monospace' }}>{data.contact}</div>
      </div>

      {data.summary && (
        <div style={{ marginBottom: 24, paddingLeft: 16, borderLeft: '2px solid #e0dbd1' }}>
          <p style={{ fontSize: 12.5, fontStyle: 'italic', lineHeight: 1.75 }}>{data.summary}</p>
        </div>
      )}

      {data.experience?.length > 0 && (
        <Section title="Experience">
          {data.experience.map((e, i) => (
            <Item key={i} title={e.role} sub={e.company} date={e.date} bullets={e.bullets} />
          ))}
        </Section>
      )}

      {data.projects?.length > 0 && (
        <Section title="Projects">
          {data.projects.map((p, i) => (
            <Item key={i} title={p.name} sub={p.tech} bullets={p.bullets} />
          ))}
        </Section>
      )}

      {data.education?.length > 0 && (
        <Section title="Education">
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{e.degree}</span>
              <span style={{ color: '#8a8070', fontSize: 11.5 }}> · {e.institution} {e.year && `· ${e.year}`}</span>
            </div>
          ))}
        </Section>
      )}

      {data.skills?.length > 0 && (
        <Section title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.skills.map((s, i) => (
              <span key={i} style={{ fontSize: 11, padding: '3px 10px', border: '1px solid #d4cec4', borderRadius: 2 }}>{s}</span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8a8070', marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function Item({ title, sub, date, bullets }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>
        {date && <div style={{ fontSize: 10.5, color: '#8a8070' }}>{date}</div>}
      </div>
      <div style={{ fontSize: 11.5, color: '#8a8070', marginBottom: 7 }}>{sub}</div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {bullets.map((b, j) => (
          <li key={j} style={{ fontSize: 12, marginBottom: 3, paddingLeft: 12, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: '#d4cec4' }}>—</span>{b}
          </li>
        ))}
      </ul>
    </div>
  );
}