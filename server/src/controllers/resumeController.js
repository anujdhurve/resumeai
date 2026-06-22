const Resume = require('../models/Resume');
const TailoredResume = require('../models/TailoredResume');
const { tailorResume: tailorWithGemini } = require('../services/geminiService');
const { extractText } = require('../services/parserService');
const { uploadFile } = require('../services/cloudinaryService');

// @POST /api/resume/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'No file uploaded' });

    // Extract text from PDF or DOCX
    const extracted = await extractText(req.file.buffer, req.file.mimetype);

    // Upload original file to Cloudinary
    const cloudinaryResult = await uploadFile(
      req.file.buffer,
      `${req.user._id}-${Date.now()}-${req.file.originalname}`
    );

    // Save to MongoDB
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      cloudinaryId: cloudinaryResult.public_id,
      extractedText: extracted
    });

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      extractedText: extracted,
      fileName: resume.fileName
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/resume/list
const listResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('-extractedText')
      .sort({ uploadedAt: -1 });

    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/resume/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume)
      return res.status(404).json({ message: 'Resume not found' });

    if (resume.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/resume/tailor
const tailorResume = async (req, res) => {
  try {
    const { resumeText, jdText, jobTitle, resumeId } = req.body;

    if (!resumeText || !jdText || !jobTitle)
      return res.status(400).json({ message: 'resumeText, jdText, and jobTitle are required' });

    const tailoredText = await tailorWithGemini(resumeText, jdText, jobTitle);

    const saved = await TailoredResume.create({
      userId: req.user._id,
      resumeId: resumeId || null,
      jobTitle,
      jdText,
      tailoredText
    });

    res.status(201).json({
      message: 'Resume tailored successfully',
      id: saved._id,
      tailoredText
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadResume, listResumes, deleteResume, tailorResume  };