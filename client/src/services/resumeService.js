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

export const exportDocx = async (tailoredText) => {
  const response = await api.post('/resume/export-docx', { tailoredText }, {
    responseType: 'blob',
  });
  return response.data;
};


export const getHistory = async () => {
  const { data } = await api.get('/history');
  return data.history;
};

export const getHistoryItem = async (id) => {
  const { data } = await api.get(`/history/${id}`);
  return data.item;
};

export const deleteHistoryItem = async (id) => {
  await api.delete(`/history/${id}`);
};