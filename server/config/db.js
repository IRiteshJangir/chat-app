import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected ✅");
    });

    mongoose.connection.on("error", (err) => {
      console.log("DB Error ❌", err);
    });

    await mongoose.connect(process.env.MONGO_URI);

  } catch (error) {
    console.error("Database connection failed:", error);
  }
};