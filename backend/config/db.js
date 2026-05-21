const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 60000, // Increased from default 30s
            socketTimeoutMS: 60000,
            retryWrites: true,
            w: 'majority',
            connectTimeoutMS: 60000,
            maxPoolSize: 10,
            family: 4 // Use IPv4
        });
        console.log("Database connected successfully");
    } catch (err) {
        console.error("DB connection error:", err.message);
        console.error("\n⚠️  TROUBLESHOOTING:");
        console.error("1. Check MongoDB Atlas dashboard - cluster might be paused");
        console.error("2. Verify your IP address is whitelisted in Atlas");
        console.error("3. Test connection: mongo 'your-connection-string'");
        console.error("4. Check credentials in .env file");
        process.exit(1); 
    }
};

module.exports = connectDB;
