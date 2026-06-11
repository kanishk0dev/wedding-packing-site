const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @GET /api/gallery - Public
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    let query = Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    if (limit) query = query.limit(parseInt(limit));
    const items = await query;
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/gallery - Admin only
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    const galleryData = { ...req.body, image: `/uploads/${req.file.filename}` };
    const item = await Gallery.create(galleryData);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @PUT /api/gallery/:id - Admin only
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    const item = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @DELETE /api/gallery/:id - Admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
