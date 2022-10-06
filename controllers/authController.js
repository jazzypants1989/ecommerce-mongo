const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @desc Login user
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    res.status(400).json({ message: "Please enter all fields" });
    throw new Error(
      "You gotta work with me a little bit here. Please provide a username and password."
    );
  }

  // Find user by username and check if user exists and is still allowed to login
  const foundUser = await User.findOne({ username });
  if (!foundUser || !!foundUser.isDeleted) {
    res.status(401).json({ message: "Unauthorized." });
    throw new Error("User either does not exist or was very naughty");
  }

  // Compare password with hashed password from database
  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    throw new Error("That ain't it, chief.");
  }

  // Create token
  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "username": foundUser.username,
        "isAdmin": foundUser.isAdmin,
        "isEmployee": foundUser.isEmployee,
        "isDeleted": foundUser.isDeleted,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Create refresh token
  const refreshToken = jwt.sign(
    { UserInfo: { username: foundUser.username } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // Create a cookie with the refresh token
  res.cookie("electriclarry", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // only transmitted over HTTPS
    sameSite: "none", // cookie will be sent in all contexts, i.e., in response to both first-party and cross-origin requests.
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });

  // Send the access token in the response containing the user's info
  res.json({ accessToken });
});

// @desc Register user
// @route POST /auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  // Confirm data

  if (!username || !email || !password) {
    // If username, email or password are missing
    res.status(400).json({ message: "Please enter all fields" });
    throw new Error("Come on, you gotta work with me here. Enter all fields.");
  }

  const userExists = await User.findOne({ username }).lean().exec(); // Check if user exists
  if (userExists) {
    res.status(409).json({ message: "User already exists" });
    throw new Error("Be original. That username is already taken.");
  }

  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      message: `User ${username} created`,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Refresh token
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.electriclarry)
    return res
      .status(401)
      .json({ message: "I do not like the taste of your cookie." });
  const refreshToken = cookies.electriclarry;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Ew, Gross. No. I forbid it." });

      const foundUser = await User.findOne({ username: decoded.username });

      if (!foundUser)
        return res.status(401).json({
          message: "I don't know who you are, but you don't belong here.",
        });

      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": foundUser.username,
            "isAdmin": foundUser.isAdmin,
            "isEmployee": foundUser.isEmployee,
            "isDeleted": foundUser.isDeleted,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      res.json({ accessToken });
    })
  );
});

// @desc Logout user
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.electriclarry) return res.sendStatus(204); // There is no cookie.
  res.clearCookie("electriclarry", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "The cookie has been destroyed. I hope you're happy." });
});

module.exports = { login, register, refresh, logout };
