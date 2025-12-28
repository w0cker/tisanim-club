const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'must provide title'],
    trim: true,
    maxlength: [100, 'title can not be more than 100 characters'],
  },
  content: {
    type: String,
    required: [true, 'must provide content']
  },
  category: {
    type: String,
    enum: ['תקנות טיס', 'בטיחות', 'היסטוריה', 'מדריכים'],
    required: true
  },
  author: {
    type: String,
    default: 'מנהל המערכת'
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', ContentSchema);