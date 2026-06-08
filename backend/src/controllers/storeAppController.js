const StoreApplication = require('../models/StoreApplication');
const User = require('../models/User');
const Store = require('../models/Store');

// GET /api/v1/store/application/status — Check own store application status
exports.getMyApplicationStatus = async (req, res) => {
  try {
    const application = await StoreApplication.findOne({ 
      user_id: req.user._id 
    }).sort({ applied_at: -1 });

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Belum ada pengajuan toko', 
        data: null 
      });
    }

    let newToken = null;
    if (application.status === 'approved') {
      const jwt = require('jsonwebtoken');
      // Fetch the updated user to get the current role
      const user = await User.findById(req.user._id);
      if (user) {
        newToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET || 'secret123',
          { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
        );
      }
    }

    res.json({
      success: true,
      message: 'Status pengajuan ditemukan',
      data: {
        ...application.toObject(),
        new_token: newToken
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// GET /api/v1/admin/store-applications — List all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await StoreApplication.find()
      .populate('user_id', 'name email')
      .sort({ applied_at: -1 });

    res.json({
      success: true,
      message: 'Daftar pengajuan toko',
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// PATCH /api/v1/admin/store-applications/:id/approve
exports.approveApplication = async (req, res) => {
  try {
    const application = await StoreApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pengajuan tidak ditemukan', 
        data: null 
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Pengajuan sudah diproses sebelumnya', 
        data: null 
      });
    }

    // 1. Update application status
    application.status = 'approved';
    application.reviewed_at = new Date();
    await application.save();

    // 2. Update user role to 'store'
    await User.findByIdAndUpdate(application.user_id, { role: 'store' });

    // 3. Create store document
    const store = await Store.create({
      owner_id: application.user_id,
      store_name: application.store_name,
      description: application.description,
      address: application.address,
      is_active: true
    });

    res.json({
      success: true,
      message: 'Pengajuan toko disetujui',
      data: { application, store }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// PATCH /api/v1/admin/store-applications/:id/reject
exports.rejectApplication = async (req, res) => {
  try {
    const { rejection_reason } = req.body;

    if (!rejection_reason || !rejection_reason.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Alasan penolakan wajib diisi', 
        data: null 
      });
    }

    const application = await StoreApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pengajuan tidak ditemukan', 
        data: null 
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Pengajuan sudah diproses sebelumnya', 
        data: null 
      });
    }

    application.status = 'rejected';
    application.rejection_reason = rejection_reason.trim();
    application.reviewed_at = new Date();
    await application.save();

    res.json({
      success: true,
      message: 'Pengajuan toko ditolak',
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// DELETE /api/v1/admin/store-applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    const application = await StoreApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pengajuan tidak ditemukan', 
        data: null 
      });
    }

    if (application.status === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus pengajuan yang masih menunggu persetujuan',
        data: null
      });
    }

    await application.deleteOne();

    res.json({
      success: true,
      message: 'Riwayat pengajuan berhasil dihapus',
      data: null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
