const mongoose = require('mongoose');

const storeApplicationSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  store_name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  rejection_reason: { 
    type: String, 
    default: null 
  },
  reviewed_at: { 
    type: Date, 
    default: null 
  }
}, { 
  timestamps: { createdAt: 'applied_at', updatedAt: false } 
});

// One pending application per user
storeApplicationSchema.index({ user_id: 1, status: 1 });

module.exports = mongoose.model('StoreApplication', storeApplicationSchema);
