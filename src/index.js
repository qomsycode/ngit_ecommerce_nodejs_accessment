const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// env variables
dotenv.config();

const connectDB = require("./db");
const errorHandler = require("./middlewares/error");
const userRoutes = require("./routes/users/user.route");
const productRoutes = require("./routes/product/product.route");
const PORT = process.env.PORT || 5000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", userRoutes);
app.use("/api", productRoutes);
app.get("/", (req, res) => {
    res.send("E-commerce API is running...");
});

// Health check endpoint to verify DB connection
app.get("/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
    res.status(200).json({
        status: "OK",
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// error handler
app.use(errorHandler);

const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
