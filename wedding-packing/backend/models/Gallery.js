const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  category: { type: String },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);
