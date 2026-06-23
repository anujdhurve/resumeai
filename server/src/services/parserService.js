const pdfParse = require('pdf-parse');

const mammoth = require('mammoth');

const extractText = async (fileBuffer, mimeType) => {
  if (mimeType === 'application/pdf') {
    const data = await pdfParse(fileBuffer);
    if (data.text.trim().length < 100)
      throw new Error('PDF appears to be image-based. Please paste your resume text instead.');
    return data.text;
  }

  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
    return value;
  }

  throw new Error('Unsupported file type. Please upload PDF or DOCX.');
};

module.exports = { extractText };