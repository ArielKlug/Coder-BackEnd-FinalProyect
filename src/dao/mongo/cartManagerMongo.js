const { cartModel } = require("./models/cartModel");

class CartManagerMongo {
  getBy = async (params) => {
    return await cartModel.findOne(params);
  };

  get = async () => {
    return await cartModel.find();
  };
  create = async (newCart) => {
    return await cartModel.create(newCart);
  };

  updateProductQuantity = async (cid, pid) => {
    return await cartModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );
  };

  emptyCart = async (cid) => {
    return await cartModel.findOneAndUpdate({ _id: cid }, { products: [] });
  };
  update = async (cid, cart) => {
    return await cartModel.findByIdAndUpdate(cid, cart);
  };
}

module.exports = CartManagerMongo;
