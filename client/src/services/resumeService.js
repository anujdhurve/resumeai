import api from './api';

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const { data } = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { resumeId, extractedText, fileName }
};

export const tailorResume = async (resumeText, jdText, jobTitle, resumeId) => {
  const { data } = await api.post('/resume/tailor', {
    resumeText,
    jdText,
    jobTitle,
    resumeId,
  });
  return data; // { id, tailoredText }
};

export const listResumes = async () => {
  const { data } = await api.get('/resume/list');
  return data.resumes;
};