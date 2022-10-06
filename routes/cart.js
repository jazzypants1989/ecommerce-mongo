const router = require("express").Router();
const cartController = require("../controllers/cartController");

// @desc Get all carts
// @route GET /carts
// @access Public

router.get("/", cartController.getCarts);

// @desc Get cart by id
// @route GET /carts/:id
// @access Public

router.get("/:id", cartController.getCartById);

// @desc Get cart by user id
// @route GET /carts/:userId
// @access Public

router.get("/:userId", cartController.getCartByUserId);

// @desc Create a cart
// @route POST /carts
// @access Private

router.post("/", cartController.createCart);

module.exports = router;
