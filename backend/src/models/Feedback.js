const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email wajib diisi'],
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: [true, 'Subjek wajib diisi'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Pesan wajib diisi'],
    trim: true
  },
  is_read: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

feedbackSchema.index({ is_read: 1, created_at: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
