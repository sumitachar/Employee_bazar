import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {

    console.log('MONGODB_URI:', process.env.MONGODB_URI);

    if (connection.isConnected) {
        console.log("Already connected to the database.");
        return;
    }

    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
        console.error("MONGODB_URI is not set in environment variables.");
        return;
    }

    try {
        console.log("Attempting to connect to MongoDB...");
        const db = await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 60000, // 60 seconds timeout
        });

        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected Successfully");
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);  // Exit the process if the connection fails
    }
}

export default dbConnect;
