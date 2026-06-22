const TailoredResume = require('../models/TailoredResume');

// @GET /api/history
const getHistory = async (req, res) => {
  try {
    const history = await TailoredResume.find({ userId: req.user._id })
      .select('-jdText -tailoredText') // exclude heavy fields in list view
      .sort({ createdAt: -1 });

    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/history/:id
const getHistoryItem = async (req, res) => {
  try {
    const item = await TailoredResume.findById(req.params.id);

    if (!item)
      return res.status(404).json({ message: 'Not found' });

    if (item.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/history/:id
const deleteHistoryItem = async (req, res) => {
  try {
    const item = await TailoredResume.findById(req.params.id);

    if (!item)
      return res.status(404).json({ message: 'Not found' });

    if (item.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await TailoredResume.findByIdAndDelete(req.params.id);

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHistory, getHistoryItem, deleteHistoryItem };