const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logger");
const errHandler = require("./middleware/errHandler");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
require("dotenv").config();
const coolPort = process.env.PORT;

// Production mode
console.log(process.env.NODE_ENV);

// Connect Database
connectDB();

// Init Middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/profile", require("./routes/api/profile"));
// app.use("/api/posts", require("./routes/api/posts"));
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    // res.sendFile(path.join(__dirname, "public", "404.html"));
    return;
  } else if (req.accepts("json")) {
    res.json({ error: "Whatever you want, it sure does not seem to be here." });
    return;
  } else {
    res
      .type("txt")
      .send("Whatever you want, it sure does not seem to be here.");
  }
});

app.use(errHandler);

app.listen(coolPort, () => console.log(`Server started on port ${coolPort}`));
