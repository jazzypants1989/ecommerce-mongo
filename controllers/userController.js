const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private

const getUsers = asyncHandler(async (req, res) => {
  const query = req.query.new;
  const users = query
    ? await User.find().sort({ _id: -1 }).limit(5).select("-password")
    : await User.find().select("-password").lean(); // .populate("Cart").
  if (!users) {
    res.status(400).json({ message: "No users found" });
    throw new Error("Somehow, there are no users. That's weird.");
  }
  res.status(200).json(users);
});

// @desc Get user by id
// @route GET /users/:id
// @access Private

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").lean(); // .populate("Cart").
  if (!user) {
    res.status(400).json({ message: "No user found" });
    throw new Error(
      "I don't think that user exists. Imaginary friends are not allowed."
    );
  }
  res.status(200).json(user);
});

// @desc Get user by username
// @route GET /users/username/:username
// @access Private

const getUserByUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .select("-password")
    .lean(); // .populate("Cart").
  if (!user) {
    res.status(400).json({ message: "No user found" });
    throw new Error(
      "I don't think that user exists. Imaginary friends are not allowed."
    );
  }
  res.status(200).json(user);
});

// @desc Get user's orders
// @route GET /users/:id/orders
// @access Private

const getUserOrders = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").lean(); // .populate("Orders").
  if (!user) {
    res.status(400).json({ message: "No user found" });
    throw new Error(
      "I don't think that user exists. Imaginary friends are not allowed."
    );
  }
  const orders = await Order.find({ user: req.params.id }).lean(); // .populate("Cart").
  if (!orders) {
    res.status(400).json({ message: "No orders found" });
    throw new Error("Somehow, there are no orders. That's weird.");
  }
  res.status(200).json(orders);
});

// @desc Get user's cart
// @route GET /users/:id/cart
// @access Private

const getUserCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").lean(); // .populate("Cart").
  if (!user) {
    res.status(400).json({ message: "No user found" });
    throw new Error(
      "I don't think that user exists. Imaginary friends are not allowed."
    );
  }
  const cart = await Cart.findById(user.Cart).lean(); // .populate("products").
  if (!cart) {
    res.status(400).json({ message: "No cart found" });
    throw new Error("Somehow, there are no carts. That's weird.");
  }
  res.status(200).json(cart);
});

// @desc Get user's stats
// @route GET /users/:id/stats
// @access Private
const getUserStats = asyncHandler(async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const data = await User.aggregate([
    {
      $match: { createdAt: { $gte: lastYear } },
      $or: { $exists: false },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json(data);
});

// @desc Create user
// @route POST /users
// @access Private
const createUser = asyncHandler(async (req, res) => {
  const { username, password, isAdmin, isEmployee, isDeleted } = req.body;

  // Confirm data

  if (!username || !password) {
    // If username or password are missing
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
    isAdmin,
    isEmployee,
    isDeleted,
  });
  if (user) {
    // Return user if created
    res.status(201).json({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      isEmployee: user.isEmployee,
      isDeleted: user.isDeleted,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
    throw new Error("Check your data. Something is wrong. Probably you.");
  }
});

// @desc Update user by body
// @route PUT /users/
// @access Private
const updateUserByBody = asyncHandler(async (req, res) => {
  const { id, username, password, isAdmin, isEmployee, isDeleted } = req.body;

  // Confirm data

  if (!username) {
    // If username is missing
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const user = await User.findById(id).exec(); // Check if user exists

  if (!user) {
    return res.status(404).json({ message: "Who is this?" });
  }

  // Check for duplicate username

  const userExists = await User.findOne({ username }).lean().exec();

  if (userExists && userExists._id.toString() !== id) {
    return res.status(409).json({ message: "User already exists, bro." });
  }

  // All good, update user

  user.username = username;
  user.isAdmin = isAdmin;
  user.isEmployee = isEmployee;
  user.isDeleted = isDeleted;

  // Check if password is being updated

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  // Return user if updated
  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    isAdmin: updatedUser.isAdmin,
    isEmployee: updatedUser.isEmployee,
    isDeleted: updatedUser.isDeleted,
    message: `${updatedUser.username} has been updated.`,
  });
});

// @desc Update user by params
// @route PUT /users/:id
// @access Private
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).exec(); // Check if user exists

  if (!user) {
    return res.status(404).json({ message: "Who is this?" });
  }

  // Check for duplicate username

  const userExists = await User.findOne({ username: req.body.username })
    .lean()
    .exec();

  if (userExists && userExists._id.toString() !== req.params.id) {
    return res.status(409).json({ message: "User already exists, bro." });
  }

  // All good, update user

  user.username = req.body.username;
  user.isAdmin = req.body.isAdmin;
  user.isEmployee = req.body.isEmployee;
  user.isDeleted = req.body.isDeleted;

  // Check if password is being updated

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await user.save();

  // Return user if updated

  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    isAdmin: updatedUser.isAdmin,
    isEmployee: updatedUser.isEmployee,
    isDeleted: updatedUser.isDeleted,
    message: `${updatedUser.username} has been updated.`,
  });
});

// @desc Delete user by params
// @route DELETE /users/:id
// @access Private
const deleteUserByParams = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Delete user by body
// @route DELETE /users
// @access Private

const deleteUserByBody = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const user = await User.findById(id);
  if (user) {
    await user.remove();
    res.json({ message: "User eliminated. Like, for real." });
  } else {
    res.status(404);
    throw new Error("User not found. Dang, I wanted to eliminate them.");
  }

  // check for orders or carts

  const orders = await Order.find({ userId: id }).exec();
  const carts = await Cart.find({ userId: id }).exec();

  // if orders or carts exist, delete them

  if (orders) {
    await Order.deleteMany({ user: id });
  }

  if (carts) {
    await Cart.deleteMany({ user: id });
  }
});

module.exports = {
  getUsers,
  getUserById,
  getUserByUsername,
  getUserOrders,
  getUserCart,
  getUserStats,
  createUser,
  updateUserByBody,
  updateUserById,
  deleteUserByParams,
  deleteUserByBody,
};
