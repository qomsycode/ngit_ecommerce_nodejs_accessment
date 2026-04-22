// @desc    Register new user
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/users/user.model");
const dotenv = require("dotenv");

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;


//registering a User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email, and password" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });


    await newUser.save();


    // Create JWT token for authentication
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });


    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error registering user", 
      error: error.message 
    });
  }
};





//     Authenticate a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error logging in user", 
      error: error.message 
    });
  }
};


// @desc    Get user data
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching user data", 
      error: error.message 
    });
  }
};
  



const getUsers = async (req, res) => {
  res.status(200).json({ message: "Get Users endpoint" });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers
};
