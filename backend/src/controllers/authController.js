const User = require('../models/User');
const Store = require('../models/Store');
const StoreApplication = require('../models/StoreApplication');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  const { name, email, password, register_as, store_name, store_description, store_address } = req.body;

  try {
    // Validasi input dasar
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi', data: null });
    }

    let userExists = await User.findOne({ email });
    if (userExists) {
      // Cek apakah user ini memiliki pengajuan toko yang ditolak
      const rejectedApp = await StoreApplication.findOne({ 
        user_id: userExists._id, 
        status: 'rejected' 
      });

      if (rejectedApp) {
        // Jika ada pengajuan yang ditolak, kita hapus data lama agar bisa mendaftar ulang
        await StoreApplication.findByIdAndDelete(rejectedApp._id);
        await User.findByIdAndDelete(userExists._id);
        userExists = null; // Reset agar bisa lanjut buat user baru
      } else {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar', data: null });
      }
    }

    // Jika register sebagai toko, validasi field toko
    if (register_as === 'store') {
      if (!store_name || !store_description || !store_address) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nama toko, deskripsi, dan alamat wajib diisi untuk pendaftaran toko', 
          data: null 
        });
      }
    }

    // Buat user (role tetap 'user' sampai admin approve jika register_as=store)
    const user = await User.create({
      name,
      email,
      password_hash: password,
      role: 'user'
    });

    let storeApplication = null;

    // Jika register sebagai toko, buat store application
    if (register_as === 'store') {
      storeApplication = await StoreApplication.create({
        user_id: user._id,
        store_name,
        description: store_description,
        address: store_address,
        status: 'pending'
      });
    }

    res.status(201).json({
      success: true,
      message: register_as === 'store' 
        ? 'Registrasi berhasil. Pengajuan toko menunggu persetujuan admin.' 
        : 'Registrasi berhasil',
      data: {
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        store_application: storeApplication ? {
          id: storeApplication._id,
          status: storeApplication.status
        } : null
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

    // Check if user has a pending store application
    let pendingApplication = null;
    if (user.role === 'user') {
      pendingApplication = await StoreApplication.findOne({ 
        user_id: user._id, 
        status: { $in: ['pending', 'rejected'] }
      }).sort({ applied_at: -1 });
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
        } : null,
        pending_store_application: pendingApplication ? {
          id: pendingApplication._id,
          status: pendingApplication.status
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
