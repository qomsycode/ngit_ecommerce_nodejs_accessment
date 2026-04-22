const express = require("express");
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../../controllers/product/product.controller");
const { protect, requireAdmin } = require("../../middlewares/auth");

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

// Admin only routes
router.post("/products", protect, requireAdmin, createProduct);
router.put("/products/:id", protect, requireAdmin, updateProduct);
router.delete("/products/:id", protect, requireAdmin, deleteProduct);

module.exports = router;

