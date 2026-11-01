const mongoose = require('mongoose');

/**
 * BlogPost model — blog articles managed by the admin.
 */
const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    cover: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
    author: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate a slug from the title if none is provided
blogPostSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
