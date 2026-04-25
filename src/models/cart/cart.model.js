const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: String,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }]
});

module.exports = mongoose.model('Cart', cartSchema);