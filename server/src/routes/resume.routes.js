const express = require('express');
const router = express.Router();
const { uploadResume, listResumes, deleteResume, tailorResume, exportDocx } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/tailor', protect, tailorResume);
router.post('/export-docx', protect, exportDocx);
router.get('/list', protect, listResumes);
router.delete('/:id', protect, deleteResume);

module.exports = router;