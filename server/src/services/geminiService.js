const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;

const buildPrompt = (resumeText, jdText, jobTitle) => {
  return `You are an expert resume writer who helps candidates write natural, specific, achievement-focused resumes — never generic corporate buzzwords.

TASK: Rewrite the resume below to be tailored for the given job description.

STRICT RULES:
1. Preserve ALL factual info (names, dates, institutions, technologies, project names) — never fabricate anything
2. DO NOT copy generic phrases directly from the JD (like "customer-focused", "customer-obsessed", "team player") into the summary. Instead, demonstrate those qualities through specific, concrete achievements from the candidate's actual background.
3. If the candidate has no formal work experience, DO NOT invent one. Instead, treat PROJECTS as the primary experience section — describe them with the same rigor as a job (impact, technologies, what was built, scale).
4. Every bullet should ideally follow this shape where possible: [Action verb] + [what was built/done] + [technology used] + [impact/result, if known]
5. Avoid filler adjectives like "highly motivated," "hardworking," "passionate" — show it through specifics instead, or omit it.
6. Reorder bullets so the most relevant to the JD appear first.
7. Return the resume in this EXACT structured format. If a section has no content, OMIT that section entirely rather than inventing content:

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

Resume to tailor:
${resumeText}

Job Title: ${jobTitle}
Job Description:
${jdText}`;
};

const tailorResume = async (resumeText, jdText, jobTitle) => {
  const prompt = buildPrompt(resumeText, jdText, jobTitle);

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