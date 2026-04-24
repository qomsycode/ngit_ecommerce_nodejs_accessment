const cart = require('../../models/cart/cart.model');

const getCart = async (req, res) => {
  try {
    const userCart = await cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.json(userCart);
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

const addToCart = async (req, res) => { 
    const { productId, quantity } = req.body;
    try {
        let userCart = await cart.findOne({ userId: req.user._id });
        if (!userCart) {
            userCart = new cart({ userId: req.user._id, items: [] });
        } 
        const itemIndex = userCart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            userCart.items[itemIndex].quantity += quantity;
        } else {
            userCart.items.push({ productId, quantity });
        }
        await userCart.save();
        res.json(userCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};