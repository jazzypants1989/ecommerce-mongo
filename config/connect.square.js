const dotenv = require("dotenv");
const { Client, Environment } = require("square");
dotenv.config();

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

module.exports = client;
