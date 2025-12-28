const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    zipCode: String
  },
  paymentStatus: {
    type: String,
    enum: ['ממתין לתשלום', 'שולם', 'בוטל'],
    default: 'ממתין לתשלום'
  },
  orderStatus: {
    type: String,
    enum: ['ממתין', 'באיחסון', 'נשלח', 'הגיע'],
    default: 'ממתין'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);