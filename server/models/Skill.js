const mongoose = require('mongoose');

/**
 * Skill model — skills shown on the portfolio.
 */
const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'Other',
    },
    level: {
      type: Number,
      min: [1, 'Level must be at least 1'],
      max: [100, 'Level cannot exceed 100'],
      default: 50,
    },
    icon: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skill', skillSchema);
