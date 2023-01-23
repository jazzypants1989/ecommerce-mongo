const router = require("express").Router();
const cartController = require("../controllers/cartController");
const {
  isEmployee,
  isAdmin,
  sameUserOrAdmin,
  verifyJwt,
} = require("../middleware/verifyJwt");

// @desc Get all carts
// @route GET /carts
// @access Admin

router.route("/").get(isAdmin, cartController.getCarts);

// @desc Get cart by id
// @route GET /carts/:id
// @access Employee

router.get("/:id", isEmployee, cartController.getCartById);

// @desc Get cart by user id
// @route GET /carts/:userId
// @access Same user or admin

router.get("/:userId", sameUserOrAdmin, cartController.getCartByUserId);

// @desc Create a cart
// @route POST /carts
// @access Any user

router.post("/", verifyJwt, cartController.createCart);

// @desc Update a cart
// @route PUT /carts/:id
// @access Same user or admin

router.put("/:id", sameUserOrAdmin, cartController.updateCart);

// @desc Delete a cart
// @route DELETE /carts/:id
// @access Same user or admin

router.delete("/:id", sameUserOrAdmin, cartController.deleteCart);

module.exports = router;
