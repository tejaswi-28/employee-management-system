require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const secretKey = process.env.JWT_SECRET_KEY;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/employee_db")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/employees", require("./routes/employees"));

app.listen(3000, () => {
  console.log(`Server started successfully`);
});
