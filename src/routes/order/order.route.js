const express = require("express");
const { checkout, getUserOrders, getOrderById, updateOrderStatus } = require("../../controllers/order/order.controller");
const { protect, requireAdmin } = require("../../middlewares/auth");

const router = express.Router();

// 1. Checkout (Convert Cart to Order)
router.post("/orders", protect, checkout);

// 2. Get all orders for the logged-in user
router.get("/orders", protect, getUserOrders);

// 3. Get a single order by ID (Users can view their own orders)
router.get("/orders/:id", protect, getOrderById);

// 4. Admin only: Update order status
router.patch("/orders/:id/status", protect, requireAdmin, updateOrderStatus);

module.exports = router;
