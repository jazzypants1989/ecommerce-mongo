const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");

// @desc Get all orders
// @route GET /orders
// @access Public

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  if (!orders) {
    res.status(400).json({ message: "No orders found" });
    throw new Error("Somehow, there are no orders. That's weird.");
  }
  res.status(200).json(orders);
});

// @desc Get order by id
// @route GET /orders/:id
// @access Public

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(400).json({ message: "No order found" });
    throw new Error("I don't think that order exists. I wish it did.");
  }
  res.status(200).json(order);
});

// @desc Get orders by user id
// @route GET /orders/:userId
// @access Public

const getOrderByUserId = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  if (!orders) {
    res.status(400).json({ message: "No orders found" });
    throw new Error("I don't think that user has any orders. I wish they did.");
  }
  res.status(200).json(orders);
});

// @desc Get monthly sales
// @route GET /orders/sales/month
// @access Admin

const getMonthlySales = asyncHandler(async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  const sales = await Order.aggregate([
    { $match: { createdAt: { $gte: previousMonth } } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);
  res.status(200).json(sales);
});

// @desc Get total sales
// @route GET /orders/sales/total
// @access Admin

const getTotalSales = asyncHandler(async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  res.status(200).json(totalSales.pop().totalSales);
});

// @desc Create an order
// @route POST /orders
// @access Private

const createOrder = asyncHandler(async (req, res) => {
  const { userId, products } = req.body;
  const order = new Order({
    userId,
    products,
  });
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc Update an order
// @route PUT /orders/:id
// @access Private

const updateOrder = asyncHandler(async (req, res) => {
  const { userId, products } = req.body;
  const order = await Order.findById(req.params.id);
  if (order) {
    order.userId = userId;
    order.products = products;
    const updatedOrder = await order.save();
    res.status(201).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Delete an order
// @route DELETE /orders/:id
// @access Private

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.remove();
    res.json({ message: "Order removed" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

module.exports = {
  getOrders,
  getOrderById,
  getOrderByUserId,
  getMonthlySales,
  getTotalSales,
  createOrder,
  updateOrder,
  deleteOrder,
};
