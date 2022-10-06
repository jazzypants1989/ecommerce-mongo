const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        message: "That's not the right kind of cookie. I want only the best.",
      });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Ew, Gross. No. I forbid it." });
    }
    req.user = decoded.UserInfo;
    next();
  });
};

module.exports = verifyJwt;
