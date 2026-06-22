export default function ModernTemplate({ data }) {
  if (!data) return null;
  return (
    <div style={{ display: 'flex', fontFamily: 'sans-serif', fontSize: 12.5, color: '#1a1814', minHeight: 500 }}>
      <div style={{ width: '34%', background: '#1a1814', color: '#f7f3ed', padding: '20px 16px', flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#fff' }}>{data.name || 'Your Name'}</div>
        {data.experience?.[0]?.role && (
          <div style={{ fontSize: 11, color: '#c0b8ac', marginBottom: 16 }}>{data.experience[0].role}</div>
        )}

        <SideSection label="Contact">
          {data.contact?.split('|').map((c, i) => (
            <div key={i} style={{ fontSize: 11, color: '#c0b8ac', marginBottom: 3 }}>{c.trim()}</div>
          ))}
        </SideSection>

        {data.skills?.length > 0 && (
          <SideSection label="Skills">
            {data.skills.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c0392b' }} />
                <span style={{ fontSize: 11, color: '#d4cec4' }}>{s}</span>
              </div>
            ))}
          </SideSection>
        )}

        {data.education?.length > 0 && (
          <SideSection label="Education">
            {data.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{e.degree}</div>
                <div style={{ fontSize: 10.5, color: '#c0b8ac' }}>{e.institution}</div>
                {e.year && <div style={{ fontSize: 10, color: '#8a8070' }}>{e.year}</div>}
              </div>
            ))}
          </SideSection>
        )}
      </div>

      <div style={{ flex: 1, padding: '20px 18px' }}>
        {data.summary && (
          <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '2px solid #c0392b' }}>
            <SectionLabel text="Summary" />
            <p style={{ fontSize: 12, lineHeight: 1.65 }}>{data.summary}</p>
          </div>
        )}

        {data.experience?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <SectionLabel text="Experience" />
            {data.experience.map((e, i) => <ExpBlock key={i} item={e} role />)}
          </div>
        )}

        {data.projects?.length > 0 && (
          <div>
            <SectionLabel text="Projects" />
            {data.projects.map((p, i) => <ExpBlock key={i} item={{ role: p.name, date: p.tech, bullets: p.bullets }} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ text }) {
  return <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c0392b', marginBottom: 8 }}>{text}</div>;
}

function ExpBlock({ item }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 12.5 }}>{item.role}</span>
        <span style={{ fontSize: 10.5, color: '#8a8070' }}>{item.date}</span>
      </div>
      <ul style={{ paddingLeft: 14, marginTop: 4 }}>
        {item.bullets.map((b, j) => <li key={j} style={{ fontSize: 11.5, marginBottom: 3 }}>{b}</li>)}
      </ul>
    </div>
  );
}

function SideSection({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c0392b', marginBottom: 8, borderBottom: '1px solid #333', paddingBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}