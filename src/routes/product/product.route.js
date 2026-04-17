const express = require("express");
const {
  
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../../controllers/product/product.controller");

const { protect } = require("../../middlewares/auth");

const router = express.Router();

router.post("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;

