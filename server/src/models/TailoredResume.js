const mongoose = require('mongoose');

const TailoredResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  jobTitle: {
    type: String,
    required: true
  },
  jdText: {
    type: String,
    required: true
  },
  tailoredText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TailoredResume', TailoredResumeSchema);