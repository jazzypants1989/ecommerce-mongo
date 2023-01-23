const router = require("express").Router();
const userController = require("../controllers/userController");
const {
  isEmployee,
  sameUserOrAdmin,
  isAdmin,
} = require("../middleware/verifyJwt");

// @desc Get all users
// @route GET /users
// @access Private

router.route("/").get(userController.getUsers);

// @desc Get user by id
// @route GET /users/:id
// @access Private

router.route("/:id").get(isEmployee, userController.getUserById);

// @desc Get user by name
// @route GET /users/:name
// @access Private

router
  .route("/username/:username")
  .get(isEmployee, userController.getUserByUsername);

// @desc Get users orders
// @route GET /users/:id/orders
// @access Private

router.route("/:id/orders").get(sameUserOrAdmin, userController.getUserOrders);

// @desc Get Users Carts
// @route GET /users/:id/carts
// @access Private

router.route("/:id/cart").get(sameUserOrAdmin, userController.getUserCart);

// @desc User Stats
// @route GET /users/stats
// @access Private

router.route("/stats").get(isAdmin, userController.getUserStats);

// @desc Create a user
// @route POST /users
// @access Private

router.route("/createuser").post(isEmployee, userController.createUser);

// @desc Update a user by ID
// @route PUT /users/:id
// @access Private

router
  .route("/updateuser/:id")
  .put(sameUserOrAdmin, userController.updateUserById);

// @desc Update a user by username
// @route PUT /users/:username
// @access Private

router
  .route("/updateuser")
  .put(sameUserOrAdmin, userController.updateUserByBody);

// @desc Delete a user by ID
// @route DELETE /users/:id
// @access Private

router
  .route("/deleteuser/:id")
  .delete(isAdmin, userController.deleteUserByParams);

// @desc Delete a user by username
// @route DELETE /users/:username
// @access Private

router.route("/deleteuser").delete(isAdmin, userController.deleteUserByBody);

module.exports = router;
