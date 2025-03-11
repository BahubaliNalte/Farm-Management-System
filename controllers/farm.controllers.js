const Farm = require('../models/farm.models.js');

exports.createFarm = async (req, res) => {
  try {
    const { location, size, soilType, amenities } = req.body;
    const farm = new Farm({
      owner: req.user._id,
      location,
      size,
      soilType,
      amenities: amenities.split(','),
    });
    await farm.save();
    res.redirect('/farms');
  } catch (error) {
    console.error('Error creating farm listing:', error); // Log the error
    res.render('createFarm', { error: 'Error creating farm listing' });
  }
};

exports.updateFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).render('editFarm', { farm: null, error: 'Farm not found' });
    }
    if (farm.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).render('editFarm', { farm: null, error: 'You are not authorized to edit this farm' });
    }
    const { location, size, soilType, amenities } = req.body;
    farm.location = location;
    farm.size = size;
    farm.soilType = soilType;
    farm.amenities = amenities.split(',');
    await farm.save();
    res.redirect('/farms');
  } catch (error) {
    console.error('Error updating farm listing:', error);
    res.render('editFarm', { farm: null, error: 'Error updating farm listing' });
  }
};

exports.getFarms = async (req, res) => {
  try {
    const farms = await Farm.find().populate('owner');
    res.render('farms', { farms });
  } catch (error) {
    res.render('farms', { error: 'Error fetching farm listings' });
  }
};

exports.getFarmById = async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate('owner');
    if (!farm) {
      return res.status(404).render('editFarm', { farm: null, error: 'Farm not found' });
    }
    if (farm.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).render('editFarm', { farm: null, error: 'You are not authorized to edit this farm' });
    }
    res.render('editFarm', { farm, error: null });
  } catch (error) {
    console.error('Error fetching farm details:', error);
    res.render('editFarm', { farm: null, error: 'Error fetching farm details' });
  }
};