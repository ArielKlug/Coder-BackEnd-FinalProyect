const {
  getProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const { RouterClass } = require("./routerClass");

class ProductsRouter extends RouterClass {
  init() {
    this.get("/", ["USER", 'USER_PREMIUM', 'ADMIN'], getProducts);
    this.get("/:pid", ["USER", "USER_PREMIUM", "ADMIN"], getOneProduct);
    this.post("/", ["USER_PREMIUM", "ADMIN"], createProduct);
    this.put("/:pid", ["USER_PREMIUM", "ADMIN"], updateProduct);
    this.delete("/pid", ["USER_PREMIUM", "ADMIN"], deleteProduct);
  }
}

module.exports = { ProductsRouter };
