const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;
const buildPrompt = (resumeText, jdText, jobTitle) => {
  return `You are an expert resume writer and ATS optimization specialist.

TASK: Rewrite the resume below to be perfectly tailored for the given job description.

STRICT RULES:
1. Preserve ALL factual info (companies, dates, education, projects) — never fabricate anything
2. Mirror the exact keywords and phrases from the JD in bullets and summary
3. Reorder bullets so most-relevant appear first
4. Strengthen the professional summary to directly address this specific role
5. Return the resume in this EXACT structured format (use these exact section headers):

NAME: [Full Name]
CONTACT: [email | phone | location | linkedin/github if present]
SUMMARY: [2-3 sentence tailored summary]
EXPERIENCE:
[Company Name] | [Role] | [Date Range]
- [bullet]
- [bullet]
[repeat for each job]
EDUCATION:
[Degree] | [Institution] | [Year]
SKILLS: [comma separated skills]
PROJECTS (if any):
[Project Name]: [description]

Resume to tailor:
${resumeText}

Job Title: ${jobTitle}
Job Description:
${jdText}`;
};

const tailorResume = async (resumeText, jdText, jobTitle) => {
  const prompt = buildPrompt(resumeText, jdText, jobTitle);

  const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 2048 }
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