const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password_hash');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found', data: null });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed', data: null });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token', data: null });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role ${req.user ? req.user.role : ''} is not authorized to access this route`, data: null });
    }
    next();
  };
};

module.exports = { protect, authorize };
