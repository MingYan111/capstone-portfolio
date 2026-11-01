const express = require('express');
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    List all projects (optionally ?featured=true)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const filter = req.query.featured === 'true' ? { featured: true } : {};
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get a single project by id
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ project });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private (admin)
 * @body    { title, description, image?, link?, github?, technologies?, featured? }
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, image, link, github, technologies, featured } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const project = await Project.create({
      title,
      description,
      image: image || '',
      link: link || '',
      github: github || '',
      technologies: Array.isArray(technologies) ? technologies : [],
      featured: Boolean(featured),
    });
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private (admin)
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const fields = ['title', 'description', 'image', 'link', 'github', 'featured'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    });
    if (Array.isArray(req.body.technologies)) project.technologies = req.body.technologies;
    project = await project.save();
    res.json({ project });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private (admin)
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
