const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
require("dotenv").config();
const coolPort = process.env.PORT;

// Connect Database

connectDB();

// Init Middleware
app.use(express.json());

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", userRoutes);
// app.use("/api/auth", require("./routes/api/auth"));
// app.use("/api/profile", require("./routes/api/profile"));
// app.use("/api/posts", require("./routes/api/posts"));

app.listen(coolPort, () => console.log(`Server started on port ${coolPort}`));
