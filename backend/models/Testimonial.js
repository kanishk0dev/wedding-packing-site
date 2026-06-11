const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  eventType: { type: String },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
