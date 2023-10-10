const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database Connected!",
      response.connection.host,
      response.connection.name
    );
  } catch (error) {
    console.log(error, ":Error");
    process.exit(1);
  }
};

module.exports = connectDB;
