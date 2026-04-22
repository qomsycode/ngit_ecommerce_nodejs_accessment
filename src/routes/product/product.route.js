const express = require("express");
const {

  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../../controllers/product/product.controller");

const { protect } = require("../../middlewares/auth");

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;

