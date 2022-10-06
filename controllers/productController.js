const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// @desc Get all products
// @route GET /products
// @access Public

const getProducts = asyncHandler(async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  let products = [];

  if (qNew) {
    products = await Product.find().sort({ createdAt: -1 }).limit(1);
  } else if (qCategory) {
    products = await Product.find({
      categories: {
        $in: [qCategory],
      },
    });
  } else {
    products = await Product.find();
  }
  if (!products) {
    res.status(400).json({ message: "No products found" });
    throw new Error("Somehow, there are no products. That's weird.");
  }
  res.status(200).json(products);
});

// @desc Get product by id
// @route GET /products/:id
// @access Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400).json({ message: "No product found" });
    throw new Error(
      "I don't think that product exists. Imaginary friends are not allowed."
    );
  }
  res.status(200).json(product);
});

// @desc Get product by name
// @route GET /products/:name
// @access Public

const getProductByName = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ name: req.params.name });
  if (!product) {
    res.status(400).json({ message: "No product found" });
    throw new Error(
      "I don't think that product exists. If it does, we want to know about it."
    );
  }
  res.status(200).json(product);
});

// @desc Get product by category
// @route GET /products/category/:category
// @access Public

const getProductByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ categories: req.params.category });
  if (!products) {
    res.status(400).json({ message: "No products found" });
    throw new Error(
      "I don't think that stuff like that exists. If it does, we want to know about it."
    );
  }
  res.status(200).json(products);
});

// @desc Get product by tag
// @route GET /products/tag/:tag
// @access Public

const getProductByTag = asyncHandler(async (req, res) => {
  const products = await Product.find({ tags: req.params.tag });
  if (!products) {
    res.status(400).json({ message: "No products found" });
    throw new Error(
      "I don't think that stuff like that exists. If it does, we want to know about it."
    );
  }
  res.status(200).json(products);
});

// @desc Create a product
// @route POST /products
// @access Private

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  const createdProduct = await product.save();
  if (!createdProduct) {
    res.status(400).json({ message: "Product not created" });
    throw new Error("Product not created");
  }
  res.status(200).json(createdProduct);
});

// @desc Update a product
// @route PUT /products/:id
// @access Private

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400).json({ message: "Product not found" });
    throw new Error("Product not found");
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedProduct);
});

// @desc Delete a product
// @route DELETE /products/:id
// @access Private

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400).json({ message: "Product not found" });
    throw new Error("Product not found");
  }
  await product.remove();
  res.status(200).json({ message: "Product removed" });
});

module.exports = {
  getProducts,
  getProductById,
  getProductByName,
  getProductByCategory,
  getProductByTag,
  createProduct,
  updateProduct,
  deleteProduct,
};
