const { CartDao } = require("../dao/factory");
const  CartRepository  = require("../repositories/cartRepository");

const cartService = new CartRepository(new CartDao());

module.exports = { cartService };
