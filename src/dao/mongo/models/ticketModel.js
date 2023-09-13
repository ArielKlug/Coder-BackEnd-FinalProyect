const { Schema, model } = require("mongoose");

const collection = "Tickets";
const ticketShema = new Schema({
  purchaseDateTime: {
    type: String,
  },
  amount: {
    type: Number,
  },
  purchaser: {
    type: String,
  },
  destination: {
    type: String,
  },
});

const ticketModel = model(collection, ticketShema);

module.exports = {
  ticketModel,
};
