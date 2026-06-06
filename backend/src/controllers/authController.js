const User = require('../models/User');
const Store = require('../models/Store');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar', data: null });
    }

    const user = await User.create({
      name,
      email,
      password_hash: password, // Mongoose pre-save hook di User model biasanya nge-hash ini, tapi mari pastikan
      role: 'user'
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });
    }

    // Get store info if store
    let storeInfo = null;
    if (user.role === 'store') {
      storeInfo = await Store.findOne({ owner_id: user._id });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        store: storeInfo ? {
          id: storeInfo._id,
          store_name: storeInfo.store_name
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
