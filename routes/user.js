const router = require("express").Router();
const userController = require("../controllers/userController");
const {
  isEmployee,
  sameUserOrAdmin,
  isAdmin,
} = require("../middleware/verifyJwt");

router.route("/").get(userController.getUsers);

router.route("/:id").get(isEmployee, userController.getUserById);

router
  .route("/username/:username")
  .get(isEmployee, userController.getUserByUsername);

router.route("/:id/orders").get(sameUserOrAdmin, userController.getUserOrders);

router.route("/:id/cart").get(sameUserOrAdmin, userController.getUserCart);

router.route("/stats").get(isAdmin, userController.getUserStats);

router.route("/createuser").post(isEmployee, userController.createUser);

router
  .route("/updateuser/:id")
  .put(sameUserOrAdmin, userController.updateUserById);

router
  .route("/updateuser")
  .put(sameUserOrAdmin, userController.updateUserByBody);

router
  .route("/deleteuser/:id")
  .delete(isAdmin, userController.deleteUserByParams);

router.route("/deleteuser").delete(isAdmin, userController.deleteUserByBody);

module.exports = router;
