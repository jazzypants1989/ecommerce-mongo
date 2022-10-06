const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/").get(userController.getUsers);

router.route("/:id").get(userController.getUserById);

router.route("/username/:username").get(userController.getUserByUsername);

router.route("/:id/orders").get(userController.getUserOrders);

router.route("/:id/cart").get(userController.getUserCart);

router.route("/createuser").post(userController.createUser);

router.route("/updateuser/:id").put(userController.updateUserById);

router.route("/updateuser").put(userController.updateUserByBody);

router.route("/deleteuser/:id").delete(userController.deleteUserByParams);

router.route("/deleteuser").delete(userController.deleteUserByBody);

module.exports = router;
