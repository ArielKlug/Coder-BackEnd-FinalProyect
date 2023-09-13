const {
  getAllCarts,
  getOneCart,
  purchase,
  addProdToCart,
  emptyCart,
  deleteProdFromCart,
  prePurchase,
} = require("../controllers/cartsController");
const { RouterClass } = require("./routerClass");

class CartsRouter extends RouterClass {
  init() {
    this.get("/", ["ADMIN"], getAllCarts);
    this.get("/:cid", ["USER", "USER_PREMIUM"], getOneCart);
    this.get('/:cid/prePurchase',["USER", "USER_PREMIUM"], prePurchase )
    this.post("/:cid/purchase", ["USER", "USER_PREMIUM"], purchase);
    this.post("/:cid/products/:pid", ["USER", "USER_PREMIUMN"], addProdToCart);
    this.delete("/:cid", ["USER", "USER_PREMIUM"], emptyCart);
    this.delete(
      "/:cid/products/:pid",
      ["USER", "USER_PREMIUM"],
      deleteProdFromCart
    );
  }
}

module.exports = { CartsRouter };
