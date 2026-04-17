const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

// Force use of Google DNS to resolve MongoDB SRV records
// This fixes common 'querySrv ECONNREFUSED' errors in restricted networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
