const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
} = require("../../controllers/user/user.controller");

const { protect } = require("../../middlewares/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/", getUsers);

module.exports = router;

