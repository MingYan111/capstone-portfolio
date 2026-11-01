const express = require('express');
const Message = require('../models/Message');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/messages
 * @desc    List all contact messages (newest first)
 * @access  Private (admin)
 */
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/messages
 * @desc    Submit a contact message (contact form)
 * @access  Public
 * @body    { name, email, subject?, message }
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email and message' });
    }
    const msg = await Message.create({
      name,
      email,
      subject: subject || '',
      message,
    });
    res.status(201).json({ message: 'Message sent successfully', id: msg._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/messages/:id/read
 * @desc    Mark a message as read
 * @access  Private (admin)
 */
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }
    msg.read = true;
    await msg.save();
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete a contact message
 * @access  Private (admin)
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }
    await msg.deleteOne();
    res.json({ message: 'Message removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
