import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongoose connect Successfully");
  } catch (err) {
    console.log("Error while connecting to MongoDB", err);
  }
}

export default connectDB;