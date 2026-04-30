const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
  // Reference to the user who owns this cart
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  items: [{
    // Reference to the specific product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    // Number of units for this specific product
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }]
}, { timestamps: true }); // Automatically track when the cart was created or updated

module.exports = mongoose.model('Cart', cartSchema);