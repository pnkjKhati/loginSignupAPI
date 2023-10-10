const express = require("express");
const connectDB = require("./src/config/dbConnection");
require("dotenv").config();

const errorHandler = require("./src/middleware/errorHandler");

const PORT = process.env.PORT || 5001;
const app = express();

connectDB();

app.use(express.json());
app.use("/api/users", require("./src/routes/userRoutes"));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is runing of port ${PORT}`);
});
