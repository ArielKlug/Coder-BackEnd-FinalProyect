const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "usuarios";
const userSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  cartId: {
    type: String,
  },
  role: {
    type: String,
  },
  documents: [
    {
      name: {
        type: String,
      },
      reference: {
        type: String,
      },
    },
  ],
  last_connection: {
    type: String,
  },
  status: {
    type: String,
  },
  last_login: {
    type: String, 
    default: new Date().toLocaleString(),
  },
});

userSchema.plugin(mongoosePaginate);

const userModel = model(collection, userSchema);

module.exports = {
  userModel,
};
