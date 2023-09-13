const { ProductDao } = require("../dao/factory");

const ProductRepository = require("../repositories/productRepository");

const productService = new ProductRepository(new ProductDao());

module.exports = {
  productService,
};
