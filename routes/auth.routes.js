const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers.js');

// Render register page
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Handle register form submission
router.post('/register', authController.register);

// Render login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Handle login form submission
router.post('/login', authController.login);

// Handle logout
router.get('/logout', authController.logout);

// Handle profile update
router.post('/update-profile', authController.updateProfile);

module.exports = router;