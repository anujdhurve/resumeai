const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;

const buildPrompt = (resumeText, jdText, jobTitle, profileContext, mode) => {
  const skillsBlock = profileContext.skills.length > 0
    ? profileContext.skills.join(', ')
    : '(none provided)';

  const projectsBlock = profileContext.projects.length > 0
    ? profileContext.projects.map(p => `- ${p.name} | Tech: ${p.tech} | ${p.description}`).join('\n')
    : '(none provided)';

  const modeInstruction = mode === 'aggressive'
    ? `MODE: AGGRESSIVE — Be strict. If a skill, project, or experience entry is NOT clearly relevant to this specific JD, OMIT it entirely rather than including it weakly. The final resume should read like it was written exclusively for this role, with no unrelated padding.`
    : `MODE: MODERATE — Keep most existing content, but reorder and re-emphasize what's most relevant to the JD. Only remove content that is clearly unrelated or would dilute the resume's focus; keep borderline-relevant items but de-prioritize them in ordering.`;

  return `You are an expert resume writer who helps candidates write natural, specific, achievement-focused resumes — never generic corporate buzzwords.

TASK: Rewrite the resume below to be tailored for the given job description, using the candidate's verified skills and projects as your source of truth for what's real and available to include.

${modeInstruction}

STRICT RULES:
1. Preserve ALL factual info (names, dates, institutions, technologies, project names) — never fabricate anything
2. The candidate's VERIFIED SKILLS and VERIFIED PROJECTS (below) are the authoritative source of what they actually know and have built. Cross-reference these against the JD's requirements to decide what to feature.
3. DO NOT copy generic phrases directly from the JD (like "customer-focused", "customer-obsessed", "team player") into the summary. Instead, demonstrate those qualities through specific, concrete achievements from the candidate's actual background.
4. If the candidate has no formal work experience, DO NOT invent one. Instead, treat PROJECTS as the primary experience section — describe them with the same rigor as a job (impact, technologies, what was built, scale).
5. Every bullet should ideally follow this shape where possible: [Action verb] + [what was built/done] + [technology used] + [impact/result, if known]
6. Avoid filler adjectives like "highly motivated," "hardworking," "passionate" — show it through specifics instead, or omit it.
7. Reorder bullets so the most relevant to the JD appear first.
8. From the VERIFIED SKILLS list, only include skills that are present there OR in the original resume — do not invent skills not mentioned anywhere in the provided context.
9. Return the resume in this EXACT structured format. If a section has no content, OMIT that section entirely rather than inventing content:

NAME: [Full Name]
CONTACT: [email | phone | location | linkedin/github if present]
SUMMARY: [2-3 sentences — concrete, specific to this candidate's actual skills/projects, naturally aligned to the role without copying JD phrases verbatim]
EXPERIENCE: [only if the candidate has real work experience]
[Company Name] | [Role] | [Date Range]
- [bullet]
EDUCATION:
[Degree] | [Institution] | [Year]
SKILLS: [comma separated skills, prioritising ones relevant to the JD]
PROJECTS:
[Project Name] | [Technologies used]
- [specific bullet about what was built and its impact]
- [specific bullet]

Original Resume:
${resumeText}

Verified Skills (from candidate's saved profile):
${skillsBlock}

Verified Projects (from candidate's saved profile):
${projectsBlock}

Job Title: ${jobTitle}
Job Description:
${jdText}`;
};

const tailorResume = async (resumeText, jdText, jobTitle, profileContext, mode) => {
  const prompt = buildPrompt(resumeText, jdText, jobTitle, profileContext, mode);

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 4096 }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || 'Gemini API request failed');
  }

  const data = await response.json();
  const tailoredText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!tailoredText) throw new Error('Gemini returned an empty response');

  return tailoredText;
};

module.exports = { tailorResume };