const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const User = require('./models/user.models.js'); // Import the User model
const authRoutes = require('./routes/auth.routes.js'); 
const farmRoutes = require('./routes/farm.routes.js');

dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// View engine
app.set('view engine', 'ejs');

// Middleware to check authentication
app.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId); // Fetch user data from the database
    } catch (err) {
      res.clearCookie('token');
    }
  }
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/farms', farmRoutes);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));