const mongoose = require("mongoose");
const { logEvents } = require("../middleware/logger");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`HOORAY, THE MONGO WAY: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    logEvents(
      `${err.message}\t${err.stack}\t${process.env.DB_STRING}`,
      "error.log"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
