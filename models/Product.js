const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    categories: {
      type: Array,
    },
    size: {
      type: String,
    },
    details: {
      type: Array,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    tags: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
