const rateLimit = require("express-rate-limit");
const { logEvents } = require("../middleware/logger");

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after 5 minutes",
  handler: (req, res, next, options) => {
    logEvents(
      `${req.ip}\t${req.method}\t${req.url}\t${options.message}`,
      "error.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
