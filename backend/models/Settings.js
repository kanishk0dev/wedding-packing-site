const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Shringaar Packing Studio' },
  tagline: { type: String, default: 'Crafting Memories, Wrapping Dreams' },
  phone: { type: String, default: '+91 98765 43210' },
  email: { type: String, default: 'info@shringaarpacking.com' },
  address: { type: String, default: 'Jaipur, Rajasthan, India' },
  whatsapp: { type: String, default: '+91 98765 43210' },
  instagram: { type: String },
  facebook: { type: String },
  youtube: { type: String },
  heroTitle: { type: String, default: 'Beautiful Packing for Your Special Moments' },
  heroSubtitle: { type: String },
  aboutText: { type: String },
  logo: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
