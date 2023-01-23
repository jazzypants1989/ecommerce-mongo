const router = require("express").Router();
const orderController = require("../controllers/orderController");
const {
  isEmployee,
  isAdmin,
  sameUserOrAdmin,
  verifyJwt,
} = require("../middleware/verifyJwt");

// @desc Get all orders
// @route GET /orders
// @access Private

router.get("/", isEmployee, orderController.getOrders);

// @desc Get order by id
// @route GET /orders/:id
// @access Private

router.get("/:id", isEmployee, orderController.getOrderById);

// @desc Get orders by user id
// @route GET /orders/:userId
// @access Private

router.get("/:userId", verifyJwt, orderController.getOrderByUserId);

// @desc Get monthly sales
// @route GET /orders/sales/month
// @access Admin

router.get("/sales/month", isAdmin, orderController.getMonthlySales);

// @desc Get total sales
// @route GET /orders/sales/total
// @access Admin

router.get("/sales/total", isAdmin, orderController.getTotalSales);

// @desc Create an order
// @route POST /orders
// @access Any user

router.post("/", verifyJwt, orderController.createOrder);

// @desc Update an order
// @route PUT /orders/:id
// @access Same user or admin

router.put("/:id", sameUserOrAdmin, orderController.updateOrder);

// @desc Delete an order
// @route DELETE /orders/:id
// @access Admin

router.delete("/:id", isAdmin, orderController.deleteOrder);

module.exports = router;
