const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @GET /api/services - Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/services/:id - Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/services - Admin only
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const serviceData = { ...req.body };
    if (req.file) serviceData.image = `/uploads/${req.file.filename}`;
    if (req.body.features) {
      serviceData.features = Array.isArray(req.body.features)
        ? req.body.features
        : req.body.features.split(',').map(f => f.trim());
    }
    // Auto-generate slug
    serviceData.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @PUT /api/services/:id - Admin only
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    if (req.body.features && typeof req.body.features === 'string') {
      updateData.features = req.body.features.split(',').map(f => f.trim());
    }
    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @DELETE /api/services/:id - Admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
