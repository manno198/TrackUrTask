const jwt = require('jsonwebtoken');

// Dummy user for authentication demo
const DUMMY_USER = {
  email: 'admin@company.com',
  password: 'admin123',
};

// @desc    Login and get JWT token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Check credentials against dummy user
    if (email !== DUMMY_USER.email || password !== DUMMY_USER.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: DUMMY_USER.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route. Please provide a valid token.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token is invalid or expired',
    });
  }
};

module.exports = { login, protect };
