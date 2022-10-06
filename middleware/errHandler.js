const { logEvents } = require("./logger");

const errHandler = (err, req, res, next) => {
  logEvents(
    `${err.message}\t${err.stack}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "error.log"
  );
  console.log(err);

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

module.exports = errHandler;
