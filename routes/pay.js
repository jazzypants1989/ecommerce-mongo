const router = require("express").Router();
const { verifyJwt } = require("../middleware/verifyJwt");
const payController = require("../controllers/payController");

// @desc Create a payment
// @route POST /pay
// @access Private

router.post("/", verifyJwt, payController.createPayment);

module.exports = router;
