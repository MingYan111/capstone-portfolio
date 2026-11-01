const express = require('express');
const Skill = require('../models/Skill');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/skills
 * @desc    List all skills
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/skills
 * @desc    Create a skill
 * @access  Private (admin)
 * @body    { name, category?, level?, icon? }
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, level, icon } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }
    const skill = await Skill.create({
      name,
      category: category || 'Other',
      level: Number(level) || 50,
      icon: icon || '',
    });
    res.status(201).json({ skill });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This skill already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/skills/:id
 * @desc    Update a skill
 * @access  Private (admin)
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    let skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    const fields = ['name', 'category', 'icon'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) skill[f] = req.body[f];
    });
    if (req.body.level !== undefined) skill.level = Number(req.body.level);
    skill = await skill.save();
    res.json({ skill });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This skill already exists' });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete a skill
 * @access  Private (admin)
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    await skill.deleteOne();
    res.json({ message: 'Skill removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
