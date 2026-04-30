const cart = require('../../models/cart/cart.model');
const product = require('../../models/product/product.model');

// Fetch the current user's cart and include product information
const getCart = async (req, res) => {
    try {
        const userCart = await cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(userCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handle adding items to cart or incrementing existing quantities
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        // Verify product exists and check initial stock availability
        const productData = await product.findById(productId);
        if (!productData) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        if (productData.stock < quantity) {
            return res.status(400).json({ message: "Product is out of stock" });
        }

        let userCart = await cart.findOne({ user: req.user._id });

        // Initialize a new cart if the user doesn't have one yet
        if (!userCart) {
            userCart = await cart.create({ 
                user: req.user._id, 
                items: [{ product: productId, quantity }] 
            });
        } else {
            // Check if product is already in the cart to increment quantity
            const itemIndex = userCart.items.findIndex(item => item.product.toString() === productId);
            
            if (itemIndex > -1) {
                userCart.items[itemIndex].quantity += quantity;
            } else {
                userCart.items.push({ product: productId, quantity });
            }
            await userCart.save();
        }
        res.json(userCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
}

// Update specific item quantities or remove them if set to zero
const updateCartItem = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    try {
        const userCart = await cart.findOne({ user: req.user._id });
        if (!userCart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = userCart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Remove item if quantity is set to 0 or less
            if (quantity <= 0) {
                userCart.items.splice(itemIndex, 1);
            } else {
                userCart.items[itemIndex].quantity = quantity;
            }
            await userCart.save();
            res.json(userCart);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear all items from the current user's cart
const removeFromCart = async (req, res) => {
    try {
        const userCart = await cart.findOne({ user: req.user._id });
        if (userCart) {
            userCart.items = [];
            await userCart.save();
        }
        res.json({ message: "Cart cleared successfully", userCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
};
