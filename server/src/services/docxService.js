const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle
} = require('docx');

function sectionHeading(text) {
  return new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    border: {
      bottom: { color: '000000', space: 2, style: BorderStyle.SINGLE, size: 6 }
    }
  });
}

function bulletParagraph(text) {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 60 }
  });
}

function generateResumeDocx(data) {
  const children = [];

  // Name
  children.push(new Paragraph({
    text: data.name || 'Your Name',
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 }
  }));

  // Contact
  children.push(new Paragraph({
    children: [new TextRun({ text: data.contact || '', size: 20, color: '555555' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 }
  }));

  // Summary
  if (data.summary) {
    children.push(sectionHeading('Professional Summary'));
    children.push(new Paragraph({ text: data.summary, spacing: { after: 150 } }));
  }

  // Experience
  if (data.experience?.length > 0) {
    children.push(sectionHeading('Experience'));
    data.experience.forEach((e) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${e.role} `, bold: true }),
          new TextRun({ text: e.company ? `— ${e.company}` : '', italics: true }),
        ],
        spacing: { before: 100 }
      }));
      if (e.date) {
        children.push(new Paragraph({ children: [new TextRun({ text: e.date, size: 18, color: '777777' })] }));
      }
      e.bullets.forEach((b) => children.push(bulletParagraph(b)));
    });
  }

  // Projects
  if (data.projects?.length > 0) {
    children.push(sectionHeading('Projects'));
    data.projects.forEach((p) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${p.name} `, bold: true }),
          new TextRun({ text: p.tech ? `(${p.tech})` : '', italics: true, size: 18, color: '777777' }),
        ],
        spacing: { before: 100 }
      }));
      p.bullets.forEach((b) => children.push(bulletParagraph(b)));
    });
  }

  // Education
  if (data.education?.length > 0) {
    children.push(sectionHeading('Education'));
    data.education.forEach((e) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: e.degree, bold: true }),
          new TextRun({ text: e.institution ? ` — ${e.institution}` : '', italics: true }),
          new TextRun({ text: e.year ? ` (${e.year})` : '', size: 18, color: '777777' }),
        ],
        spacing: { after: 60 }
      }));
    });
  }

  // Skills
  if (data.skills?.length > 0) {
    children.push(sectionHeading('Skills'));
    children.push(new Paragraph({ text: data.skills.join(' · ') }));
  }

  return new Document({
    sections: [{ properties: {}, children }]
  });
}

async function generateDocxBuffer(data) {
  const doc = generateResumeDocx(data);
  return await Packer.toBuffer(doc);
}

module.exports = { generateDocxBuffer };