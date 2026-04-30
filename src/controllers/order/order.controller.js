const Order = require("../../models/order/order.model");
const Cart = require("../../models/cart/cart.model");
const Product = require("../../models/product/product.model");

const checkout = async (req, res) => {
  const userId = req.user._id;

  try {
    // 1. Fetch the user's cart and populate the products
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Calculate the totalAmount of the order
    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += item.product.price * item.quantity;
    }

    // 3. Keep track of items we successfully deduct, so we can roll back if needed
    const successfullyDeductedItems = [];

    // 4. Try to deduct stock for each item atomically
    for (const item of cart.items) {
      const productId = item.product._id;
      const qty = item.quantity;

      // ATOMIC UPDATE: Only deduct IF stock >= qty
      const result = await Product.updateOne(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } }
      );

      if (result.modifiedCount === 0) {
        // OH NO! The update failed. It means we don't have enough stock.
        
        // ROLLBACK: We must put the stock back for items we already successfully deducted
        for (const deductedItem of successfullyDeductedItems) {
          await Product.updateOne(
            { _id: deductedItem.product._id },
            { $inc: { stock: deductedItem.quantity } } // Put the quantity back!
          );
        }

        return res.status(400).json({ 
          message: `Not enough stock for product: ${item.product.name}. Order aborted.` 
        });
      }

      // If successful, push it to our tracking array in case a future item fails
      successfullyDeductedItems.push(item);
    }

    // 5. If we made it here, all stock was deducted successfully! Create the Order.
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      priceAtPurchase: item.product.price
    }));

    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      status: "pending"
    });

    // 6. Clear the cart
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Step 3: Fetching Orders
const getUserOrders = async (req, res) => {
  const userId = req.user._id;
  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("items.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;
  try {
    const order = await Order.findById(orderId).populate("items.product", "name price image");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Verify the order belongs to the user requesting it (unless admin)
    if (order.user.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Step 4: Admin Status Update
const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkout,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};