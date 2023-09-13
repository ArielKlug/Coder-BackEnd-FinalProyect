const { Schema, model } = require("mongoose");

const collection = "messages";

const messageSchema = new Schema({
  user: String,

  message: String,
});

const messageModel = model(collection, messageSchema);

module.exports = {
  messageModel,
};
