const { messageModel } = require("./models/messagesModel");

class MessagesManagerMongo {
  create = async (newMessage) => {
    return await messageModel.create(newMessage);
  };
  get = async () => {
    return await messageModel.find();
  };
}

module.exports = MessagesManagerMongo;
