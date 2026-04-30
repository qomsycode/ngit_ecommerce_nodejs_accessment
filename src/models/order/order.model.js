const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Reference to the user who owns this order
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
    },
    // Lock in the price at checkout
    priceAtPurchase: {
      type: Number,
      required: true
    }
  }],

  // The grand total of the order
  totalAmount: {
    type: Number,
    required: true
  },

  // Track the current state of the order
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);