const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/settings', require('./routes/settings'));

// Home route
app.get('/', (req, res) => {
  res.json({ message: '✅ Shringaar Packing Studio API is running!' });
});

// Seed route
app.get('/seed-data', async (req, res) => {
  try {
    const Service = require('./models/Service');
    const RealUser = require('./models/User');
    const Testimonial = require('./models/Testimonial');
    const Settings = require('./models/Settings');

    await Service.deleteMany({});
    await RealUser.deleteMany({});
    await Testimonial.deleteMany({});
    await Settings.deleteMany({});

    await RealUser.create({
      name: 'Super Admin',
      email: 'admin@shringaar.com',
      password: 'Admin@123',
      role: 'superadmin'
    });

    await Settings.create({
      siteName: 'Shringaar Packing Studio',
      tagline: 'Crafting Memories, Wrapping Dreams',
      phone: '+91 98765 43210',
      email: 'info@shringaarpacking.com',
      address: 'Jaipur, Rajasthan, India',
      whatsapp: '+91 98765 43210'
    });

    await Service.insertMany([
      { title: 'Lehenga Packing', slug: 'lehenga-packing', category: 'wedding', icon: '👗', description: 'Exquisite packing for bridal lehengas with premium wrapping material, floral decorations, and personalized name tags.', shortDescription: 'Elegant packing for bridal lehengas', features: ['Premium wrapping material', 'Floral decoration', 'Name tag and card', 'Tissue paper lining', 'Ribbon finish'], isActive: true, order: 1 },
      { title: 'Suit Packing', slug: 'suit-packing', category: 'wedding', icon: '🤵', description: 'Beautiful packing for groom suits, sherwani sets, and other formal wear.', shortDescription: 'Packing for groom suits and sherwanis', features: ['Custom size boxes', 'Satin lining', 'Bow and ribbon', 'Personalized card', 'Gift wrap option'], isActive: true, order: 2 },
      { title: 'Saree Packing', slug: 'saree-packing', category: 'wedding', icon: '🥻', description: 'Traditional and modern packing for sarees with decorative elements.', shortDescription: 'Traditional packing for sarees', features: ['Decorative box', 'Silk lining', 'Mirror work decoration', 'Custom embellishments', 'Gift card'], isActive: true, order: 3 },
      { title: 'Ring Ceremony Trays', slug: 'ring-ceremony-trays', category: 'wedding', icon: '💍', description: 'Gorgeous decorative trays for ring ceremonies and engagement functions.', shortDescription: 'Decorative trays for ring ceremonies', features: ['Floral arrangement', 'Pearl decoration', 'Gold and silver motifs', 'LED lighting option', 'Custom theme'], isActive: true, order: 4 },
      { title: 'Jewellery Packing', slug: 'jewellery-packing', category: 'wedding', icon: '💎', description: 'Secure and beautiful packing for all types of jewellery.', shortDescription: 'Secure jewellery gift packing', features: ['Padded interior', 'Velvet lining', 'Individual compartments', 'Lock option', 'Branding available'], isActive: true, order: 5 },
      { title: 'Baby Shower Packing', slug: 'baby-shower-packing', category: 'baby-shower', icon: '👶', description: 'Sweet and adorable packing for baby shower gifts and ceremonies.', shortDescription: 'Sweet packing for baby shower', features: ['Pastel color themes', 'Cute baby motifs', 'Personalized message', 'Gift hamper option', 'Multiple sizes'], isActive: true, order: 6 },
      { title: 'Birthday Gift Packing', slug: 'birthday-gift-packing', category: 'birthday', icon: '🎂', description: 'Fun and festive packing for birthday gifts of all ages.', shortDescription: 'Fun birthday gift wrapping', features: ['Age appropriate themes', 'Balloon decorations', 'Photo option', 'Multiple gift sets', 'Same day service'], isActive: true, order: 7 },
      { title: 'Anniversary Packing', slug: 'anniversary-packing', category: 'anniversary', icon: '❤️', description: 'Romantic and elegant packing for anniversary gifts.', shortDescription: 'Romantic anniversary gift packing', features: ['Rose decoration', 'Gold and rose gold finish', 'Love message card', 'Photo frame option', 'Couple themes'], isActive: true, order: 8 },
      { title: 'Food Items Packing', slug: 'food-items-packing', category: 'food', icon: '🍱', description: 'Hygienic and attractive packing for food items and mithai.', shortDescription: 'Hygienic food gift packing', features: ['Food safe materials', 'Airtight options', 'Festival themes', 'Bulk orders welcome', 'Custom branding'], isActive: true, order: 9 }
    ]);

    await Testimonial.insertMany([
      { name: 'Priya Sharma', location: 'Jaipur', message: 'Absolutely loved the lehenga packing! Everyone at the wedding was asking about it.', rating: 5, eventType: 'wedding', isActive: true, order: 1 },
      { name: 'Ravi Gupta', location: 'Delhi', message: 'Ring ceremony trays were beyond expectations. Very professional team!', rating: 5, eventType: 'wedding', isActive: true, order: 2 },
      { name: 'Meera Agarwal', location: 'Jaipur', message: 'Baby shower packing was so cute! My guests loved every gift.', rating: 5, eventType: 'baby-shower', isActive: true, order: 3 },
      { name: 'Sunita Verma', location: 'Bikaner', message: 'Anniversary gift packing was gorgeous. The presentation was perfect!', rating: 4, eventType: 'anniversary', isActive: true, order: 4 }
    ]);

    res.json({
      success: true,
      message: '🎉 All data seeded successfully!',
      data: { services: 9, admin: 'admin@shringaar.com', password: 'Admin@123' }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    require('./utils/seedAdmin');
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
