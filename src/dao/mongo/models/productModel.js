const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "products";

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: Number,
  thumbnail: String,
  code: {
    type: String,
    unique: true,
    required: true,
  },
  stock: Number,
  category: {
    type: String,
    Index: true,
  },
  owner: { type: String, ref: "usuarios" },
});
productSchema.plugin(mongoosePaginate);

const productModel = model(collection, productSchema);

module.exports = {
  productModel,
};
