const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farm.controllers.js');
const authMiddleware = require('../middlewares/auth.middlewares.js'); // Ensure this line is correct

// Render create farm page
router.get('/create', authMiddleware, (req, res) => {
  res.render('createFarm', { error: null });
});

// Handle create farm form submission
router.post('/create', authMiddleware, farmController.createFarm);

// Render edit farm page
router.get('/edit/:id', authMiddleware, farmController.getFarmById);

// Handle update farm form submission
router.post('/edit/:id', authMiddleware, farmController.updateFarm);

// Render farm listings
router.get('/', farmController.getFarms);

module.exports = router;