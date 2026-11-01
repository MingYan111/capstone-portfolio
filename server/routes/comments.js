const express = require('express');
const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/posts/:postId/comments
 * @desc    List all comments of a blog post
 * @access  Public
 */
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/posts/:postId/comments
 * @desc    Add a comment to a blog post
 * @access  Public
 * @body    { name, email?, content }
 */
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const { name, email, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ message: 'Please provide name and content' });
    }
    const comment = await Comment.create({
      postId: post._id,
      name,
      email: email || '',
      content,
    });
    res.status(201).json({ comment });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (admin)
 */
router.delete('/comments/:id', protect, adminOnly, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
