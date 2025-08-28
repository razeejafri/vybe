import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/VYBE`);
        console.log("db connected");
    } catch (error) {
        console.log("db error", error.message, process.env.MONGODB_URL)
    }
}

export default connectDb; 