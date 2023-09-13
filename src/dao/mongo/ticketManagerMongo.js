const { ticketModel } = require("./models/ticketModel");

class TicketManagerMongo {
  create = async (newTicket) => {
    return await ticketModel.create(newTicket);
  };
  get = async () => {
    return await ticketModel.find();
  };
  getBy = async (params) => {
    return await ticketModel.findOne(params);
  };
  update = async (tid, doc) => {
    return await ticketModel.findByIdAndUpdate(tid, { $set: doc });
  };
  delete = async (tid) => {
    return await ticketModel.findByIdAndDelete(tid);
  };
}

module.exports = TicketManagerMongo;
