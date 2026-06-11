const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error('❌ Connection Error:', err.message); process.exit(1); });

// Define schemas inline
const serviceSchema = new mongoose.Schema({
  title: String, slug: String, description: String,
  shortDescription: String, category: String, icon: String,
  image: String, features: [String], isActive: Boolean, order: Number
});

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String
});

const testimonialSchema = new mongoose.Schema({
  name: String, location: String, message: String,
  rating: Number, eventType: String, isActive: Boolean, order: Number
});

const settingsSchema = new mongoose.Schema({
  siteName: String, tagline: String, phone: String,
  email: String, address: String, whatsapp: String
});

const bcrypt = require('bcryptjs');

const Service = mongoose.model('Service', serviceSchema);
const User = mongoose.model('User', userSchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const Settings = mongoose.model('Settings', settingsSchema);

const runSeed = async () => {
  try {
    // Clear existing data
    await Service.deleteMany({});
    await User.deleteMany({});
    await Testimonial.deleteMany({});
    await Settings.deleteMany({});
    console.log('🗑️  Cleared old data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    await User.create({
      name: 'Super Admin',
      email: 'admin@shringaar.com',
      password: hashedPassword,
      role: 'superadmin'
    });
    console.log('✅ Admin created: admin@shringaar.com / Admin@123');

    // Create settings
    await Settings.create({
      siteName: 'Shringaar Packing Studio',
      tagline: 'Crafting Memories, Wrapping Dreams',
      phone: '+91 98765 43210',
      email: 'info@shringaarpacking.com',
      address: 'Jaipur, Rajasthan, India',
      whatsapp: '+91 98765 43210'
    });
    console.log('✅ Settings created');

    // Create all 9 services
    await Service.insertMany([
      {
        title: 'Lehenga Packing', slug: 'lehenga-packing', category: 'wedding', icon: '👗',
        description: 'Exquisite packing for bridal lehengas with premium wrapping material, floral decorations, and personalized name tags. We ensure your precious outfit is beautifully presented and safely protected.',
        shortDescription: 'Elegant packing for bridal lehengas',
        features: ['Premium wrapping material', 'Floral decoration', 'Name tag & card', 'Tissue paper lining', 'Ribbon finish'],
        isActive: true, order: 1
      },
      {
        title: 'Suit Packing', slug: 'suit-packing', category: 'wedding', icon: '🤵',
        description: 'Beautiful packing for groom suits, sherwani sets, and other formal wear. Custom boxes with elegant finishing touches for gifting at weddings and special occasions.',
        shortDescription: 'Handcrafted packing for groom suits & sherwanis',
        features: ['Custom size boxes', 'Satin lining', 'Bow & ribbon', 'Personalized card', 'Gift wrap option'],
        isActive: true, order: 2
      },
      {
        title: 'Saree Packing', slug: 'saree-packing', category: 'wedding', icon: '🥻',
        description: 'Traditional and modern packing for sarees with decorative elements. Perfect for wedding gifts, festive occasions, and family ceremonies.',
        shortDescription: 'Traditional packing for sarees & dress materials',
        features: ['Decorative box', 'Silk lining', 'Mirror work decoration', 'Custom embellishments', 'Gift card'],
        isActive: true, order: 3
      },
      {
        title: 'Ring Ceremony Trays', slug: 'ring-ceremony-trays', category: 'wedding', icon: '💍',
        description: 'Gorgeous decorative trays for ring ceremonies and engagement functions. Adorned with flowers, pearls, and traditional motifs to make your ceremony truly memorable.',
        shortDescription: 'Decorative trays for ring & engagement ceremonies',
        features: ['Floral arrangement', 'Pearl decoration', 'Gold/silver motifs', 'LED lighting option', 'Custom theme'],
        isActive: true, order: 4
      },
      {
        title: 'Jewellery Packing', slug: 'jewellery-packing', category: 'wedding', icon: '💎',
        description: 'Secure and beautiful packing for all types of jewellery including necklaces, bangles, earrings, and bridal sets. Padded interiors ensure safety while stunning exteriors make them perfect gifts.',
        shortDescription: 'Secure & beautiful jewellery gift packing',
        features: ['Padded interior', 'Velvet lining', 'Individual compartments', 'Lock option', 'Branding available'],
        isActive: true, order: 5
      },
      {
        title: 'Baby Shower Packing', slug: 'baby-shower-packing', category: 'baby-shower', icon: '👶',
        description: 'Sweet and adorable packing for baby shower gifts and ceremonies. Pastel colors, cute motifs, and personalized messages make these perfect for welcoming the new arrival.',
        shortDescription: 'Sweet packing for baby shower functions',
        features: ['Pastel color themes', 'Cute baby motifs', 'Personalized message', 'Gift hamper option', 'Multiple sizes'],
        isActive: true, order: 6
      },
      {
        title: 'Birthday Gift Packing', slug: 'birthday-gift-packing', category: 'birthday', icon: '🎂',
        description: 'Fun and festive packing for birthday gifts of all ages. From kids colorful wrapping to elegant adult gift boxes, we create the perfect presentation for every birthday celebration.',
        shortDescription: 'Fun & festive birthday gift wrapping',
        features: ['Age-appropriate themes', 'Balloon decorations', 'Photo option', 'Multiple gift sets', 'Same day service'],
        isActive: true, order: 7
      },
      {
        title: 'Anniversary Packing', slug: 'anniversary-packing', category: 'anniversary', icon: '❤️',
        description: 'Romantic and elegant packing for anniversary gifts. Red roses, gold accents, and personalized love messages create a heartfelt presentation for your special celebration.',
        shortDescription: 'Romantic packing for anniversary gifts',
        features: ['Rose decoration', 'Gold/rose gold finish', 'Love message card', 'Photo frame option', 'Couple themes'],
        isActive: true, order: 8
      },
      {
        title: 'Food Items Packing', slug: 'food-items-packing', category: 'food', icon: '🍱',
        description: 'Hygienic and attractive packing for food items, mithai, dry fruits, and return gifts. Ideal for festivals, weddings, and corporate gifting with food-safe materials.',
        shortDescription: 'Hygienic packing for mithai & food gifts',
        features: ['Food-safe materials', 'Airtight options', 'Festival themes', 'Bulk orders welcome', 'Custom branding'],
        isActive: true, order: 9
      }
    ]);
    console.log('✅ All 9 services created');

    // Create testimonials
    await Testimonial.insertMany([
      { name: 'Priya Sharma', location: 'Jaipur', message: 'Absolutely loved the lehenga packing! It was so beautifully done, everyone at the wedding was asking about it. Will definitely use again.', rating: 5, eventType: 'wedding', isActive: true, order: 1 },
      { name: 'Ravi Gupta', location: 'Delhi', message: 'Ordered ring ceremony trays and they were beyond expectations. Very professional team and timely delivery. Highly recommended!', rating: 5, eventType: 'wedding', isActive: true, order: 2 },
      { name: 'Meera Agarwal', location: 'Jaipur', message: 'The baby shower packing was so cute and adorable! My guests loved every gift. The personalization made it extra special.', rating: 5, eventType: 'baby-shower', isActive: true, order: 3 },
      { name: 'Sunita Verma', location: 'Bikaner', message: 'Got anniversary gift packing done and it was gorgeous. The rose decoration was fresh and the presentation was perfect. Very happy!', rating: 4, eventType: 'anniversary', isActive: true, order: 4 }
    ]);
    console.log('✅ Testimonials created');

    console.log('\n🎉 ALL DATA SEEDED SUCCESSFULLY!');
    console.log('================================');
    console.log('Admin Email:    admin@shringaar.com');
    console.log('Admin Password: Admin@123');
    console.log('Services:       9 services added');
    console.log('Testimonials:   4 reviews added');
    console.log('================================');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
};

mongoose.connection.once('open', runSeed);