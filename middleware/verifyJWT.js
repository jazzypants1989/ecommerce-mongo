const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
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

const isEmployee = (req, res, next) => {
  verifyJwt(req, res, () => {
    if (req.user.isEmployee) {
      next();
    } else {
      res.status(401).json({
        message: "You are not one of the chosen few. You are not an employee.",
      });
    }
  });
};

const sameUserOrAdmin = (req, res, next) => {
  verifyJwt(req, res, () => {
    if (req.user.username === req.params.username || req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({
        message: "You do not have the power. Try again when you are stronger.",
      });
    }
  });
};

const isAdmin = (req, res, next) => {
  verifyJwt(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({
        message:
          "There is only one Electric Larry. You are not him. He also does not like you.",
      });
    }
  });
};

module.exports = { verifyJwt, isEmployee, sameUserOrAdmin, isAdmin };
