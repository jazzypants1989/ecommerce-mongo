const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

// @desc Get all carts
// @route GET /carts
// @access Admin

const getCarts = asyncHandler(async (req, res) => {
  const carts = await Cart.find();
  if (!carts) {
    res.status(400).json({ message: "No carts found" });
    throw new Error("Somehow, there are no carts. That's weird.");
  }
  res.status(200).json(carts);
});

// @desc Get cart by id
// @route GET /carts/:id
// @access Employee

const getCartById = asyncHandler(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) {
    res.status(400).json({ message: "No cart found" });
    throw new Error(
      "I don't think that cart exists. You should maybe buy something. That would be cool."
    );
  }
  res.status(200).json(cart);
});

// @desc Get cart by user id
// @route GET /carts/:userId
// @access Same user or admin

const getCartByUserId = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) {
    res.status(400).json({ message: "No cart found" });
    throw new Error(
      "I don't think that cart exists. More customers would be cool."
    );
  }
  res.status(200).json(cart);
});

// @desc Create a cart
// @route POST /carts
// @access Any user

const createCart = asyncHandler(async (req, res) => {
  const { userId, products } = req.body;
  const cart = new Cart({
    userId,
    products,
  });
  const createdCart = await cart.save();
  res.status(201).json(createdCart);
});

// @desc Update a cart
// @route PUT /carts/:id
// @access Same user or admin

const updateCart = asyncHandler(async (req, res) => {
  const { userId, products } = req.body;
  const cart = await Cart.findById(req.params.id);
  if (cart) {
    cart.userId = userId;
    cart.products = products;
    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});

// @desc Delete a cart
// @route DELETE /carts/:id
// @access Same user or admin

const deleteCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (cart) {
    await cart.remove();
    res.json({ message: "Cart removed" });
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});

module.exports = {
  getCarts,
  getCartById,
  getCartByUserId,
  createCart,
  updateCart,
  deleteCart,
};
