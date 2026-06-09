const Feedback = require('../models/Feedback');

// POST /api/v1/feedback — Publik: kirim masukan dari form kontak
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama wajib diisi', data: null });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email wajib diisi', data: null });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, message: 'Subjek wajib diisi', data: null });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Pesan wajib diisi', data: null });
    }

    const feedback = await Feedback.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Feedback berhasil dikirim',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// GET /api/v1/admin/feedback — Admin: tampilin semua daftar masukan
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ created_at: -1 });

    res.json({
      success: true,
      message: 'Daftar feedback',
      data: feedbacks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// PATCH /api/v1/admin/feedback/:id/read — Admin: tandain masukan kalau udah dibaca
exports.markAsRead = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback tidak ditemukan', data: null });
    }

    feedback.is_read = true;
    await feedback.save();

    res.json({
      success: true,
      message: 'Feedback ditandai sudah dibaca',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// DELETE /api/v1/admin/feedback/:id — Admin: hapus masukan
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback tidak ditemukan', data: null });
    }

    await feedback.deleteOne();

    res.json({
      success: true,
      message: 'Feedback berhasil dihapus',
      data: null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
