const User = require('../models/user.models.js'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();
    res.redirect('/auth/login');
  } catch (error) {
    res.render('register', { error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (error) {
    res.render('login', { error: 'Error logging in' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.userId;
    await User.findByIdAndUpdate(userId, { name, email, phone });
    res.redirect('/');
  } catch (error) {
    res.render('home', { user: req.user, error: 'Error updating profile' });
  }
};