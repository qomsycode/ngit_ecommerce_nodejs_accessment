const Order = rrquire("../../models/orders/order.model");

const createOrder = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    const order = await Order.create({
      user: userId,
      cart: cart._id,
      totalAmount,
      status: "pending",
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const paidOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.updateOne({ status: "paid" });

    // reduce stock of each product in the order


    const cart = await Cart.findById(order.cart).populate("items.product");
    
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: Not enough stock for product ${product.name} });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // clear the user's cart after successful payment

    await Cart.findByIdAndDelete(order.cart);

    res.json({ message: "Order marked as paid" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};