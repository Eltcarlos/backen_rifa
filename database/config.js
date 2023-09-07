const mongoose = require("mongoose");

// This function will handle the connection to the database.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB online!");
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to DB");
  }
};

module.exports = connectDB;
