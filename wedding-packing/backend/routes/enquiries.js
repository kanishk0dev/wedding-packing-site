const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { protect } = require('../middleware/auth');

// @POST /api/enquiries - Public
router.post('/', async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ success: true, data: enquiry, message: 'Your enquiry has been submitted! We will contact you soon.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @GET /api/enquiries - Admin only
router.get('/', protect, async (req, res) => {
  try {
    const { status, eventType, isRead, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Enquiry.countDocuments(filter)
    ]);
    res.json({
      success: true, data: enquiries,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/enquiries/stats - Admin only
router.get('/stats', protect, async (req, res) => {
  try {
    const [total, newCount, contacted, completed, unread] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ status: 'contacted' }),
      Enquiry.countDocuments({ status: 'completed' }),
      Enquiry.countDocuments({ isRead: false })
    ]);
    res.json({ success: true, data: { total, new: newCount, contacted, completed, unread } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/enquiries/:id - Admin only
router.get('/:id', protect, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id, { isRead: true }, { new: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/enquiries/:id - Admin only
router.put('/:id', protect, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @DELETE /api/enquiries/:id - Admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
