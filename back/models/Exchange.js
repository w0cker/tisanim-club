const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'must provide title'],
    trim: true,
    maxlength: [100, 'title can not be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'must provide description'],
    maxlength: [500, 'description can not be more than 500 characters'],
  },
  productType: {
    type: String,
    enum: ['מטוס', 'מסוק', 'דרון', 'חלקים', 'אביזרים'],
    required: true
  },
  condition: {
    type: String,
    enum: ['חדש', 'כמעט חדש', 'משומש', 'דורש תיקון'],
    required: true
  },
  owner: {
    type: String,
    default: 'משתמש אנונימי'
  },
  wantedItems: {
    type: String,
    maxlength: [200, 'text can not be more than 200 characters']
  },
  price: {
    type: Number,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  images: [String],
  status: {
    type: String,
    enum: ['פעיל', 'במשא ומתן', 'הוחלף', 'בוטל'],
    default: 'פעיל'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exchange', ExchangeSchema);