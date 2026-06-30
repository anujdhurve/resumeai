const Profile = require('../models/Profile');

// @GET /api/profile
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Profile.create({ userId: req.user._id, skills: [], projects: [] });
    }
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const { skills, projects, photo, displayName, headline } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      {
        skills: skills || [],
        projects: projects || [],
        photo: photo ?? null,
        displayName: displayName || '',
        headline: headline || '',
        updatedAt: Date.now()
      },
      { returnDocument: 'after', upsert: true }
    );

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };