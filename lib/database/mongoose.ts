// Estabishing the database connection and caching database for optimization
//NextJS is serverless which means stateless. Once it initiate the connection and after receiving the response it closes the connection

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null
    }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error("MONGODB_URL missing");

    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: 'stylon',
        bufferCommands: false
    })

    cached.conn = await cached.promise;
    return cached.conn;
}