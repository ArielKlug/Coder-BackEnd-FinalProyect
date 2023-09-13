const { productModel } = require("./models/productModel");

class ProductManagerMongo {
  get = async () => {
    return await productModel.find();
  };
  getBy = async (params) => {
    return await productModel.findOne( params );
  };
  create = async (newProduct) => {
    return await productModel.create(newProduct);
  };
  update = async (pid, prodToReplace) => {
    return await productModel.findByIdAndUpdate(pid, prodToReplace);
  };
  delete = async (pid) => {
    return await productModel.findByIdAndDelete(pid);
  };
}

module.exports = ProductManagerMongo;
