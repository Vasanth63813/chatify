import mongoose from "mongoose";

export const connectDb=async()=> {
    try {
        const connect= await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected db ",connect.connection.host)
    } catch (error) {
        console.error("Error in connection db",error);
        process.exit(1)// 1 status code means fail 0 means success
    }
}