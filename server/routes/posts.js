const express = require('express');
const BlogPost = require('../models/BlogPost');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    List published blog posts (optionally ?published=false for admin)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const filter = req.query.published === 'false' ? {} : { published: true };
    const posts = await BlogPost.find(filter).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by id (or slug)
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    let post = null;
    // ObjectId is 24 hex chars — otherwise treat as slug
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      post = await BlogPost.findById(req.params.id);
    } else {
      post = await BlogPost.findOne({ slug: req.params.id });
    }
    if (!post || !post.published) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/posts
 * @desc    Create a blog post
 * @access  Private (admin)
 * @body    { title, content, slug?, excerpt?, cover?, tags?, published?, author? }
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, content, slug, excerpt, cover, tags, published, author } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const post = await BlogPost.create({
      title,
      content,
      slug: slug || undefined,
      excerpt: excerpt || '',
      cover: cover || '',
      tags: Array.isArray(tags) ? tags : [],
      published: published === undefined ? true : Boolean(published),
      author: author || 'Admin',
    });
    res.status(201).json({ post });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A post with this slug already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a blog post
 * @access  Private (admin)
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    let post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const fields = ['title', 'content', 'excerpt', 'cover', 'author', 'published'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) post[f] = req.body[f];
    });
    if (req.body.slug !== undefined) post.slug = req.body.slug;
    if (Array.isArray(req.body.tags)) post.tags = req.body.tags;
    post = await post.save();
    res.json({ post });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A post with this slug already exists' });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a blog post
 * @access  Private (admin)
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
