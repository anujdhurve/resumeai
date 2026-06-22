function stripMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

export function parseResume(text) {
  const get = (label) => {
    const rx = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`, 'i');
    return (text.match(rx)?.[1] || '').trim();
  };

  const name = stripMarkdown(get('NAME'));
  const contact = stripMarkdown(get('CONTACT'));
  const summary = stripMarkdown(get('SUMMARY'));  
  const skillsRaw = get('SKILLS');

  // Experience blocks
  const expSection = get('EXPERIENCE');
  const experience = expSection
    ? expSection.split(/\n(?=[A-Za-z].*\|)/).filter(Boolean).map(block => {
        const lines = block.trim().split('\n');
        const parts = lines[0].split('|').map(s => s.trim());
        const bullets = lines.slice(1).filter(l => l.trim().startsWith('-')).map(l => stripMarkdown(l.replace(/^-\s*/, '').trim()));
        return { company: parts[0] || '', role: parts[1] || '', date: parts[2] || '', bullets };
      })
    : [];

  // Education
  const eduSection = get('EDUCATION');
  const education = eduSection
    ? eduSection.split('\n').filter(Boolean).map(l => {
        const parts = l.split('|').map(s => s.trim());
        return { degree: parts[0] || l, institution: parts[1] || '', year: parts[2] || '' };
      })
    : [];

  // Projects (now with "Name | Technologies" header + bullets, like Experience)
  const projSection = get('PROJECTS');
  const projects = projSection
    ? projSection.split(/\n(?=[A-Za-z].*\|)/).filter(Boolean).map(block => {
        const lines = block.trim().split('\n');
        const parts = lines[0].split('|').map(s => s.trim());
        const bullets = lines.slice(1).filter(l => l.trim().startsWith('-')).map(l => stripMarkdown(l.replace(/^-\s*/, '').trim()));
        return { name: parts[0] || '', tech: parts[1] || '', bullets };
      })
    : [];

  const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

  return { name, contact, summary, experience, education, skills, projects };
}