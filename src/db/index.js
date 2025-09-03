import mongoose from "mongoose";
import { DB_NAME, DB_Query } from "../constant.js";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const connectionString = "mongodb+srv://rakeshnit322_db_user:jMFc7fFqvICiagTe@cluster0.pplgqqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        console.log("Attempting to connect to MongoDB...");
        
        const connectionInstance = await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`\nMongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;