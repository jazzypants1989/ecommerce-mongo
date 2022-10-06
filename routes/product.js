const router = require("express").Router();
const productController = require("../controllers/productController");
const {
  isEmployee,
  isAdmin,
  sameUserOrAdmin,
} = require("../middleware/verifyJwt");

// @desc Get all products
// @route GET /products
// @access Public

router.get("/", productController.getProducts);

// @desc Get product by id
// @route GET /products/:id
// @access Public

router.get("/:id", productController.getProductById);

// @desc Get product by name
// @route GET /products/:name
// @access Public

router.get("/:name", productController.getProductByName);

// @desc Create a product
// @route POST /products
// @access Private

router.post("/", isEmployee, productController.createProduct);

// @desc Update a product
// @route PUT /products/:id
// @access Private

router.put("/:id", isEmployee, productController.updateProduct);

// @desc Delete a product
// @route DELETE /products/:id
// @access Private

router.delete("/:id", isEmployee, productController.deleteProduct);

module.exports = router;
